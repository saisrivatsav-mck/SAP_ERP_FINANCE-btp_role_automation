/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"mckfin/btp_role_automation/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});