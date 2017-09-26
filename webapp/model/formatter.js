sap.ui.define([], function() {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue: function(sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(0);
		},

		stateText: function(sState) {
			if (sState === "NW") {
				return "New offer from shipper";
			} else if (sState === "AC") {
				return "Accepted by forwarding agent";
			} else if (sState === "RJ") {
				return "Rejected by forwarding agent";
			} else if (sState === "CF") {
				return "Confirmed by shipper";
			} else if (sState === "CN") {
				return "Offer canceled";
			} else {
				return "Not offered to forwarding agent";
			}
		},

		stateTndrst: function(sState) {
			if (sState === "NW") {
				return "Warning";
			} else if (sState === "AC") {
				return "Success";
			} else if (sState === "CF" || sState === "CN") {
				return "None";
			} else {
				return "Error";
			}

		},

		editableInput: function(sState) {
			if (sState === "CF" || sState === "CN") {
				return false;
			} else {
				return true;
			}

		},

		enabledAccept: function(sState) {
			if (sState === "AC" || sState === "CF" || sState === "CN") {
				return false;
			} else {
				return true;
			}

		},

		enabledReject: function(sState) {
			if (sState === "RJ" || sState === "CF" || sState === "CN") {
				return false;
			} else {
				return true;
			}

		},

		statusIcon: function(sState) {
			if (sState === "NW") {
				return "sap-icon://sys-help";
			} else if (sState === "AC") {
				return "sap-icon://sys-enter";
			} else if (sState === "CF") {
				return "sap-icon://employee-approvals";
			} else if (sState === "CN") {
				return "sap-icon://employee-rejections";
			} else {
				return "sap-icon://alert";
			}

		}

	};

});