/*global define, ngwConfig*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "ngw/modelWidget/Widget",
    "ngw/modelWidget/ErrorDisplayMixin",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/UserWidget.html",
    "dojo/_base/array",
    "dojo/on",
    // template
    "dijit/form/ValidationTextBox",
    "dojox/layout/TableContainer",
    "dojox/form/CheckedMultiSelect",
    "ngw/form/KeynameTextBox",
    "ngw/form/DisplayNameTextBox",
    // css
    "xstyle/css!" + ngwConfig.amdUrl + 'dojox/form/resources/CheckedMultiSelect.css'
], function (
    declare,
    lang,
    Widget,
    ErrorDisplayMixin,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    template,
    array,
    on
) {
    return declare([Widget, ErrorDisplayMixin, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        identity: "auth_user",
        title: "Пользователь",

        postCreate: function () {
            this.inherited(arguments);
            this.password.set('required', this.operation === 'create');

            if (this.operation !== 'create') {
                this.password.set(
                    'placeHolder',
                    "Для изменения пароля заполните это поле"
                );
            }

            if (this.operation === 'create') {
                this.memberOf.addOption(lang.clone(this.groups));
            }
        },

        validateWidget: function () {
            var widget = this;

            var result = { isValid: true, error: [] };

            array.forEach([this.displayName, this.keyname, this.password], function (subw) {
                // форсируем показ значка при проверке
                subw._hasBeenBlurred = true;
                subw.validate();

                // если есть ошибки, фиксируем их
                if (!subw.isValid()) {
                    result.isValid = false;
                }
            });

            return result;
        },

        _setValueAttr: function (value) {
            this.displayName.set("value", value.display_name);
            this.keyname.set("value", value.keyname);

            // По простому не работает, сделаем по сложному
            var groups = lang.clone(this.groups);
            if (this.value) {
                array.forEach(groups, function (opt) {
                    opt.selected = (this.value.member_of.indexOf(opt.value) !== -1);
                }, this);
            }
            this.memberOf.addOption(this.groups);
        },

        _getValueAttr: function () {
            return {
                display_name: this.displayName.get("value"),
                keyname: this.keyname.get("value"),
                password: this.password.get("value"),
                member_of: this.memberOf.get("value")
            };
        }
    });
});