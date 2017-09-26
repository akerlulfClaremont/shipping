sap.ui.define([
		"com/tender/agent/model/GroupSortState",
		"sap/ui/model/json/JSONModel"
	], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function() {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("TndrActp").length, 1, "The sorting by TndrActp returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("Tknum").length, 1, "The sorting by Tknum returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("TndrActp").length, 1, "The group by TndrActp returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});


	QUnit.test("Should set the sorting to TndrActp if the user groupes by TndrActp", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("TndrActp");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "TndrActp", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by Tknum and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "TndrActp");

		this.oGroupSortState.sort("Tknum");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});