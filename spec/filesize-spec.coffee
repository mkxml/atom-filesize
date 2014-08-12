{WorkspaceView} = require("atom")
StatusBarView = require(atom.packages.resolvePackagePath("status-bar") +
"/lib/status-bar-view")
Filesize = require("../lib/filesize")

describe "Filesize", ->

  beforeEach ->
    spyOn(Filesize, "activate")
    spyOn(Filesize, "exec")
    spyOn(Filesize, "deactivate")
    atom.workspaceView = new WorkspaceView()
    atom.workspaceView.statusBar = new StatusBarView()
    waitsForPromise ->
      atom.packages.activatePackage("filesize")
    runs ->
      atom.workspaceView.attachToDom()

  describe "when testing begins", ->
    it "should be alive", ->
      expect(atom.packages.isPackageActive("filesize")).toBe(true)
      expect(atom.packages.getActivePackages().length).toEqual(1)
      expect(Filesize.activate).toHaveBeenCalled()

  describe "when .exec() is called", ->
    it "should refresh filesize label", ->
      expect(atom.workspaceView.statusBar.find(".file-size").length).toEqual(0)
      Filesize.exec ->
        expect(atom.workspaceView.statusBar.find(".file-size").length)
        .toEqual(1)
