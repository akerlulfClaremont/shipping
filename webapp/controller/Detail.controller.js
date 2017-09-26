/*global location */
sap.ui.define([
	"com/tender/agent/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/tender/agent/model/formatter",
	"sap/m/MessageBox",
	'sap/m/MessageToast'
], function(BaseController, JSONModel, formatter, MessageBox, MessageToast) {
	"use strict";
	return BaseController.extend("com.tender.agent.controller.Detail", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = this.getModel("detailView");
			sap.m.URLHelper.triggerEmail(null, oViewModel.getProperty("/shareSendEmailSubject"), oViewModel.getProperty(
				"/shareSendEmailMessage"));
		},
		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("detailView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},
		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */
		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("TenderAgentSet", {
					Tknum: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},
		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");
			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}
			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.Tknum,
				sObjectName = oObject.Tknum,
				oViewModel = this.getModel("detailView");
			this.getOwnerComponent().oListSelector.selectAListItem(sPath);
			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject", oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage", oResourceBundle.getText("shareSendEmailObjectMessage", [
				sObjectName,
				sObjectId,
				location.href
			]));

			this.statusChange(oObject, oView);

		},
		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");
			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		/**
		 *@memberOf com.tender.agent.controller.Detail
		 */
		onAccept: function(oEvent) {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding(),
				sPath = oElementBinding.getPath(),
				oObject = oView.getModel().getObject(sPath),
				oModel = oView.getModel(),
				oUri = "/TenderAgentSet('" + oObject.Tknum + "')";

			// validate input before update/POST request
			if (this.inputValidate(oEvent)) {
				// accept status
				oObject.Tndrst = "AC";

				// actual costs
				oObject.TndrActp = oView.byId("actCost").getValue();
				oObject.TndrText = oView.byId("tndrText").getValue();

				// update request
				oModel.update(oUri, oObject, null, function() {
					MessageBox.show("Update successful");
				}, function() {
					MessageBox.alert("Update failed");
				});

				this.statusChange(oObject, oView);

			}

		},

		/**
		 *@memberOf com.tender.agent.controller.Detail
		 */
		onReject: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding(),
				sPath = oElementBinding.getPath(),
				oObject = oView.getModel().getObject(sPath),
				oModel = oView.getModel(),
				oUri = "/TenderAgentSet('" + oObject.Tknum + "')";

			// reject tender status
			oObject.Tndrst = "RJ";
			oObject.TndrActp = "0";
			oObject.TndrText = oView.byId("tndrText").getValue();

			oModel.update(oUri, oObject, null, function() {
				MessageBox.show("Update successful");
			}, function() {
				MessageBox.alert("Update failed");
			});

			this.statusChange(oObject, oView);
		},

		inputValidate: function(oEvent) {
			var actCost = this.getView().byId("actCost"),
				actCostValue = actCost.getValue();

			if (isNaN(actCostValue) || actCostValue <= 0) {
				actCost.setValueState("Error");
				jQuery.sap.require("sap.m.MessageBox");
				MessageBox.alert("Provide actual costs");
				return false;
			} else {
				return true;
			}

		},

		statusChange: function(oObject, oView) {
			// test
			var state, text;

			// set status text and state
			switch (oObject.Tndrst) {
				case "NW":
					text = "New offer from shipper";
					state = "Warning";
					break;
				case "AC":
					text = "Accepted by forwarding agent";
					state = "Success";
					break;
				case "RJ":
					text = "Rejected by forwarding agent";
					state = "Error";
					break;
				case "CF":
					text = "Confirmed by shipper";
					state = "None";
					break;
				case "CN":
					text = "Offer canceled";
					state = "None";
					break;	
			}

			oView.byId("status").setText(text);
			oView.byId("status").setState(state);

			// reset valueState on change
			oView.byId("actCost").setValueState("None");
		}

	});
});