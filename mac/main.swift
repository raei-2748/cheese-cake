// Stacky for Mac: a native window around the live Stacky site.
// Records sync through Stacky's own GitHub sync; the site updates itself on each deploy.
import Cocoa
import WebKit
import UniformTypeIdentifiers

let homeURL = URL(string: "https://raei-2748.github.io/cheese-cake/")!
let appHost = "raei-2748.github.io"
// Google blocks sign-in inside embedded web views by user agent; present as Safari.
let safariUA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15"

final class AppDelegate: NSObject, NSApplicationDelegate, WKUIDelegate, WKNavigationDelegate, WKDownloadDelegate, NSWindowDelegate {
  var window: NSWindow!
  var web: WKWebView!
  var popups: [NSWindow] = []
  var downloadDestinations: [ObjectIdentifier: URL] = [:]

  func applicationDidFinishLaunching(_ n: Notification) {
    buildMenu()
    let config = WKWebViewConfiguration()
    config.websiteDataStore = .default()
    config.preferences.javaScriptCanOpenWindowsAutomatically = true
    config.preferences.isElementFullscreenEnabled = true
    config.defaultWebpagePreferences.allowsContentJavaScript = true
    web = WKWebView(frame: .zero, configuration: config)
    web.customUserAgent = safariUA
    web.uiDelegate = self
    web.navigationDelegate = self
    web.allowsBackForwardNavigationGestures = true
    web.setValue(false, forKey: "drawsBackground")   // no white flash in dark mode

    window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 1320, height: 860),
                      styleMask: [.titled, .closable, .miniaturizable, .resizable],
                      backing: .buffered, defer: false)
    window.title = "Stacky"
    window.titlebarAppearsTransparent = true
    window.titleVisibility = .hidden
    window.minSize = NSSize(width: 720, height: 520)
    window.backgroundColor = NSColor(name: nil) { $0.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua ? NSColor(red: 0.098, green: 0.098, blue: 0.098, alpha: 1) : .white }
    window.contentView = web
    window.delegate = self
    window.isReleasedWhenClosed = false
    window.setFrameAutosaveName("StackyMain")
    if !window.setFrameUsingName("StackyMain") { window.center() }
    window.makeKeyAndOrderFront(nil)
    web.load(URLRequest(url: homeURL))
    NSApp.activate(ignoringOtherApps: true)
  }

  func applicationShouldHandleReopen(_ s: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
    if !flag { window.makeKeyAndOrderFront(nil) }
    return true
  }
  func applicationShouldTerminateAfterLastWindowClosed(_ s: NSApplication) -> Bool { false }

  // ── Links: Stacky stays here; everything else opens in your browser ──
  func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
    if action.shouldPerformDownload { decisionHandler(.download); return }
    guard let url = action.request.url else { decisionHandler(.allow); return }
    let host = url.host ?? ""
    let isPopup = webView !== web
    if url.scheme == "webcal" || url.scheme == "mailto" { NSWorkspace.shared.open(url); decisionHandler(.cancel); return }
    if isPopup || host == appHost || host.hasSuffix("google.com") || url.scheme == "about" || url.scheme == "blob" || url.scheme == "data" || action.targetFrame?.isMainFrame == false {
      decisionHandler(.allow); return
    }
    if action.navigationType == .linkActivated || action.targetFrame?.isMainFrame == true {
      NSWorkspace.shared.open(url); decisionHandler(.cancel); return
    }
    decisionHandler(.allow)
  }
  func webView(_ webView: WKWebView, decidePolicyFor response: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
    decisionHandler(response.canShowMIMEType ? .allow : .download)
  }

  // window.open: Google sign-in gets its own small window (it needs window.opener); other links go to the browser.
  func webView(_ webView: WKWebView, createWebViewWith config: WKWebViewConfiguration, for action: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
    let url = action.request.url
    let host = url?.host ?? ""
    if url == nil || url?.absoluteString == "about:blank" || host.hasSuffix("google.com") {
      let popupWeb = WKWebView(frame: .zero, configuration: config)
      popupWeb.customUserAgent = safariUA
      popupWeb.uiDelegate = self
      popupWeb.navigationDelegate = self
      let w = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 500, height: 640), styleMask: [.titled, .closable, .resizable], backing: .buffered, defer: false)
      w.title = "Sign in"
      w.contentView = popupWeb
      w.isReleasedWhenClosed = false
      w.center()
      w.makeKeyAndOrderFront(nil)
      popups.append(w)
      return popupWeb
    }
    if let url { NSWorkspace.shared.open(url) }
    return nil
  }
  func webViewDidClose(_ webView: WKWebView) {
    popups.filter { $0.contentView === webView }.forEach { $0.close() }
    popups.removeAll { $0.contentView === webView }
  }

  // ── File pickers (import backup, .ics) ──
  func webView(_ webView: WKWebView, runOpenPanelWith parameters: WKOpenPanelParameters, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping ([URL]?) -> Void) {
    let panel = NSOpenPanel()
    panel.allowsMultipleSelection = parameters.allowsMultipleSelection
    panel.canChooseDirectories = false
    panel.beginSheetModal(for: window) { completionHandler($0 == .OK ? panel.urls : nil) }
  }
  func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
    let a = NSAlert(); a.messageText = message; a.beginSheetModal(for: window) { _ in completionHandler() }
  }
  func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
    let a = NSAlert(); a.messageText = message; a.addButton(withTitle: "OK"); a.addButton(withTitle: "Cancel")
    a.beginSheetModal(for: window) { completionHandler($0 == .alertFirstButtonReturn) }
  }

  // ── Downloads (Export backup) go to ~/Downloads ──
  func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) { download.delegate = self }
  func webView(_ webView: WKWebView, navigationResponse: WKNavigationResponse, didBecome download: WKDownload) { download.delegate = self }
  func download(_ download: WKDownload, decideDestinationUsing response: URLResponse, suggestedFilename: String, completionHandler: @escaping (URL?) -> Void) {
    let dir = FileManager.default.urls(for: .downloadsDirectory, in: .userDomainMask)[0]
    var dest = dir.appendingPathComponent(suggestedFilename)
    var i = 1
    while FileManager.default.fileExists(atPath: dest.path) {
      let base = (suggestedFilename as NSString).deletingPathExtension, ext = (suggestedFilename as NSString).pathExtension
      dest = dir.appendingPathComponent("\(base) \(i)" + (ext.isEmpty ? "" : ".\(ext)")); i += 1
    }
    downloadDestinations[ObjectIdentifier(download)] = dest
    completionHandler(dest)
  }
  func downloadDidFinish(_ download: WKDownload) {
    if let dest = downloadDestinations.removeValue(forKey: ObjectIdentifier(download)) { NSWorkspace.shared.activateFileViewerSelecting([dest]) }
  }

  // ── Menus: needed for copy/paste and the usual shortcuts ──
  func buildMenu() {
    let main = NSMenu()
    let appItem = NSMenuItem(); main.addItem(appItem)
    let app = NSMenu()
    app.addItem(withTitle: "About Stacky", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
    app.addItem(.separator())
    app.addItem(withTitle: "Settings…", action: #selector(openSettings), keyEquivalent: ",")
    app.addItem(.separator())
    app.addItem(withTitle: "Hide Stacky", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
    let others = app.addItem(withTitle: "Hide Others", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h"); others.keyEquivalentModifierMask = [.command, .option]
    app.addItem(.separator())
    app.addItem(withTitle: "Quit Stacky", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
    appItem.submenu = app

    let editItem = NSMenuItem(); main.addItem(editItem)
    let edit = NSMenu(title: "Edit")
    edit.addItem(withTitle: "Undo", action: Selector(("undo:")), keyEquivalent: "z")
    let redo = edit.addItem(withTitle: "Redo", action: Selector(("redo:")), keyEquivalent: "z"); redo.keyEquivalentModifierMask = [.command, .shift]
    edit.addItem(.separator())
    edit.addItem(withTitle: "Cut", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
    edit.addItem(withTitle: "Copy", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
    edit.addItem(withTitle: "Paste", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
    edit.addItem(withTitle: "Select All", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
    editItem.submenu = edit

    let goItem = NSMenuItem(); main.addItem(goItem)
    let go = NSMenu(title: "Go")
    for (title, hash, key) in [("Overview", "dash", "1"), ("Study", "focus", "2"), ("Today", "today", "3"), ("Calendar", "calendar", "4"), ("Assessments", "assess", "5")] {
      let item = go.addItem(withTitle: title, action: #selector(goTo(_:)), keyEquivalent: key); item.representedObject = hash
    }
    go.addItem(.separator())
    go.addItem(withTitle: "Back", action: #selector(goBack), keyEquivalent: "[")
    go.addItem(withTitle: "Forward", action: #selector(goForward), keyEquivalent: "]")
    goItem.submenu = go

    let viewItem = NSMenuItem(); main.addItem(viewItem)
    let view = NSMenu(title: "View")
    view.addItem(withTitle: "Reload", action: #selector(reload), keyEquivalent: "r")
    view.addItem(withTitle: "Actual Size", action: #selector(zoomReset), keyEquivalent: "0")
    view.addItem(withTitle: "Zoom In", action: #selector(zoomIn), keyEquivalent: "+")
    view.addItem(withTitle: "Zoom Out", action: #selector(zoomOut), keyEquivalent: "-")
    view.addItem(.separator())
    let fs = view.addItem(withTitle: "Enter Full Screen", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f"); fs.keyEquivalentModifierMask = [.command, .control]
    viewItem.submenu = view

    let winItem = NSMenuItem(); main.addItem(winItem)
    let win = NSMenu(title: "Window")
    win.addItem(withTitle: "Minimise", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
    win.addItem(withTitle: "Close", action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
    winItem.submenu = win
    NSApp.windowsMenu = win
    NSApp.mainMenu = main
  }
  @objc func openSettings() { show(); web.evaluateJavaScript("location.hash='#settings'", completionHandler: nil) }
  @objc func goTo(_ item: NSMenuItem) { show(); if let h = item.representedObject as? String { web.evaluateJavaScript("location.hash='#\(h)'", completionHandler: nil) } }
  @objc func goBack() { web.goBack() }
  @objc func goForward() { web.goForward() }
  @objc func reload() { web.reloadFromOrigin() }
  @objc func zoomIn() { web.pageZoom = min(2, web.pageZoom + 0.1) }
  @objc func zoomOut() { web.pageZoom = max(0.6, web.pageZoom - 0.1) }
  @objc func zoomReset() { web.pageZoom = 1 }
  func show() { if !window.isVisible { window.makeKeyAndOrderFront(nil) } }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
