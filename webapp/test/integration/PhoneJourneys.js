jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"com/tender/agent/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/tender/agent/test/integration/pages/App",
	"com/tender/agent/test/integration/pages/Browser",
	"com/tender/agent/test/integration/pages/Master",
	"com/tender/agent/test/integration/pages/Detail",
	"com/tender/agent/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.tender.agent.view."
	});

	sap.ui.require([
		"com/tender/agent/test/integration/NavigationJourneyPhone",
		"com/tender/agent/test/integration/NotFoundJourneyPhone",
		"com/tender/agent/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});