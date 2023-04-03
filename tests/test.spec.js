import { expect } from "chai";

describe("Array", () => {
  describe("#sort", () => {
    it("should sorting array by name", () => {
      var names = ["Anthony", "Stav", "Adar", "Ido", "Maor", "Neoray"];
      expect(names.sort()).to.be.eql(["Adar", "Anthony", "Ido", "Maor", "Neoray", "Stav"]);
    });
  });
});