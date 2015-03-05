FilesizeCalculator = require("../lib/filesize-calculator")
os = require("os")

#FilesizeCalculator instance
filesizeCalculator = null

describe "FilesizeCalculator", ->

  beforeEach ->
    waitsForPromise ->
      atom.workspace.open("../fixtures/test.txt")
    filesizeCalculator = new FilesizeCalculator()

  #TODO: Test .getSize() effectively
  describe "when calling .getSize()", ->
    it "should return the correct size in bytes", ->
      filesizeCalculator.getSize (size, err) ->
        expect(err).toEqual(null)
        expect(atom.workspace.getActivePaneItem()).toExist()
        expect(size).toEqual(5)

  describe "when calling .makeReadable()", ->

    describe "when size is 0", ->
      it "should return 0 bytes", ->
        filesizeCalculator.makeReadable 0, null, (size, err) ->
          expect(err).toEqual(null)
          expect(size).toEqual("0 bytes")

    describe "when size is 1", ->
      it "should return 1 byte", ->
        filesizeCalculator.makeReadable 1, null, (size, err) ->
          expect(err).toEqual(null)
          expect(size).toEqual("1 byte")

    describe "when size < 1024 bytes", ->
      it "should display results in bytes when with 1024 multiple value", ->
        filesizeCalculator.makeReadable 1023, null, (size, err) ->
          expect(err).toEqual(null)
          expect(size).toEqual("1023 bytes")
      it "should display resulsts in KB with 1000 multiple value", ->
        filesizeCalculator.setMultiple(1000)
        filesizeCalculator.makeReadable 1023, null, (size, err) ->
          expect(err).toEqual(null)
          expect(size).toEqual("1.02 KB")
    describe "when size < 1048576", ->
      it "should display results in KiB with 1024 multiple value", ->
        filesizeCalculator.makeReadable 1048000, null, (size, err) ->
          expect(err).toEqual(null)
          expect(size).toEqual("1023.44 KiB")
      it "should display results in KiB with 1000 multiple value", ->
        filesizeCalculator.setMultiple(1000)
        filesizeCalculator.makeReadable 1048000, null, (size, err) ->
          expect(err).toEqual(null)
          expect(size).toEqual("1.05 MB")
    describe "when size < 1073741824", ->
      it "should display results in KiB with 1024 multiple value", ->
        filesizeCalculator.makeReadable 1073700000, null, (size, err) ->
          expect(err).toEqual(null)
          expect(size).toEqual("1023.96 MiB")
      it "should display results in KiB with 1000 multiple value", ->
        filesizeCalculator.setMultiple(1000)
        filesizeCalculator.makeReadable 1073700000, null, (size, err) ->
          expect(err).toEqual(null)
          expect(size).toEqual("1.07 GB")
