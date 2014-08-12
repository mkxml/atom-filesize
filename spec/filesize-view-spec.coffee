{WorkspaceView} = require("atom")
StatusBarView = require(atom.packages.resolvePackagePath("status-bar") +
"/lib/status-bar-view")
FilesizeView = require("../lib/filesize-view")

#FilesizeView instance
view = null

describe "FilesizeView", ->

  beforeEach ->
    atom.workspaceView = new WorkspaceView()
    #Mock status-bar component for testing
    atom.workspaceView.statusBar = new StatusBarView()
    waitsForPromise ->
      atom.packages.activatePackage("filesize")
    runs ->
      atom.workspaceView.attachToDom()
      atom.workspace.open("filesize-spec.coffee")
      view = new FilesizeView()

  it "should create and append the file-size div to the status-bar", ->
    expect(atom.workspaceView.statusBar.length).toEqual(1)
    expect(atom.workspaceView.statusBar.find(".file-size").length).toEqual(0)
    view.show()
    expect(atom.workspaceView.statusBar.find(".file-size").length).toEqual(1)

  it "should update the value of size when .display() is called", ->
    expect(atom.workspaceView.statusBar.length).toEqual(1)
    expect(atom.workspaceView.statusBar.find(".file-size").length).toEqual(0)
    view.display("9 KB")
    expect(atom.workspaceView.statusBar.find(".file-size").text())
    .toEqual("9 KB")
    view.display("7 KB")
    expect(atom.workspaceView.statusBar.find(".file-size").text())
    .toEqual("7 KB")

  it "should unappend any file-size div when .hide() is called", ->
    expect(atom.workspaceView.statusBar.length).toEqual(1)
    expect(atom.workspaceView.statusBar.find(".file-size").length).toEqual(0)
    view.display("9 KB")
    expect(atom.workspaceView.statusBar.find(".file-size").text())
    .toEqual("9 KB")
    view.hide()
    expect(atom.workspaceView.statusBar.find(".file-size").length).toEqual(0)
    expect(view.visible).toBe(false)

  it "should hide and not display again when .destroy() is called", ->
    expect(atom.workspaceView.statusBar.length).toEqual(1)
    expect(atom.workspaceView.statusBar.find(".file-size").length).toEqual(0)
    view.display("9 KB")
    expect(atom.workspaceView.statusBar.find(".file-size").text())
    .toEqual("9 KB")
    view.destroy()
    expect(atom.workspaceView.statusBar.find(".file-size").length).toEqual(0)
    expect(view.visible).toBe(false)
    expect(view.shouldDisplay).toBe(false)
    view.display("9 KB")
    expect(atom.workspaceView.statusBar.find(".file-size").length).toEqual(0)
