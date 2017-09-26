jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 TenderAgentSet in the list

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
		"com/tender/agent/test/integration/MasterJourney",
		"com/tender/agent/test/integration/NavigationJourney",
		"com/tender/agent/test/integration/NotFoundJourney",
		"com/tender/agent/test/integration/BusyJourney",
		"com/tender/agent/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});