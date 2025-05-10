$(function () {
  'use strict';
  var editPermissionForm = $('#editPermissionForm');

  // jQuery Validation
  // --------------------------------------------------------------------
  if (editPermissionForm.length) {
    editPermissionForm.validate({
      rules: {
        editTipoDeCategoria: {
          required: true
        },
        editNombre: {
          required: true
        },
        editDescripcion: {
          required: true
        }
      }
    });
  }
});
