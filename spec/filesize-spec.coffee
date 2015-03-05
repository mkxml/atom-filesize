StatusBarView = require(atom.packages.resolvePackagePath("status-bar") +
"/lib/status-bar-view")
Filesize = require("../lib/filesize")

describe "Filesize", ->

  _workspaceView = null

  beforeEach ->
    spyOn(Filesize, "activate")
    spyOn(Filesize, "exec")
    spyOn(Filesize, "deactivate")
    atom.workspace.addBottomPanel(item: new StatusBarView())
    workspaceView = atom.views.getView(atom.workspace)
    _workspaceView = workspaceView
    waitsForPromise ->
      atom.packages.activatePackage("filesize")
    runs ->
      jasmine.attachToDOM(workspaceView)

  describe "when testing begins", ->
    it "should be alive", ->
      expect(atom.packages.isPackageActive("filesize")).toBe(true)
      expect(atom.packages.getActivePackages().length).toEqual(1)
      expect(Filesize.activate).toHaveBeenCalled()

  describe "when .exec() is called", ->
    it "should refresh filesize label", ->
      expect(_workspaceView.querySelectorAll(".file-size").length).toEqual(0)
      Filesize.exec ->
        expect(_workspaceView.querySelectorAll(".file-size").length)
        .toEqual(1)
