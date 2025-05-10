$(function () {
  'use strict';

  var dataTablePermissions = $('.datatables-permissions'),
    assetPath = '../../../app-assets/',
    dt_permission;

  if ($('body').attr('data-framework') === 'laravel') {
    assetPath = $('body').attr('data-asset-path');
  }

  // Inicializar DataTable
  if (dataTablePermissions.length) {
    dt_permission = dataTablePermissions.DataTable({
      ajax: assetPath + 'data/categories-list.json',
      columns: [
        { data: null, defaultContent: '' },
        { data: 'tipo_de_categoria' },
        { data: 'nombre' },
        { data: 'descripcion' },
        { data: null, defaultContent: '' }
      ],
      columnDefs: [
        {
          className: 'control',
          orderable: false,
          responsivePriority: 2,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },
        {
          targets: -1,
          title: 'Acciones',
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              '<button class="btn btn-sm btn-icon edit-record" data-nombre="' + full.nombre + '" data-bs-toggle="modal" data-bs-target="#editPermissionModal">' +
              feather.icons['edit'].toSvg({ class: 'font-medium-2 text-body' }) +
              '</button>' +
              '<button class="btn btn-sm btn-icon delete-record">' +
              feather.icons['trash'].toSvg({ class: 'font-medium-2 text-body' }) +
              '</button>'
            );
          }
        }
      ],
      order: [[1, 'asc']],
      dom: '<"d-flex justify-content-between align-items-center header-actions text-nowrap mx-1 row mt-75"' +
        '<"col-sm-12 col-lg-4 d-flex justify-content-center justify-content-lg-start" l>' +
        '<"col-sm-12 col-lg-8"<"dt-action-buttons d-flex align-items-center justify-content-lg-end justify-content-center flex-md-nowrap flex-wrap"<"me-1"f><"user_role mt-50 width-200 me-1">B>>' +
        '><"text-nowrap" t>' +
        '<"d-flex justify-content-between mx-2 row mb-1"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      language: {
        sLengthMenu: 'Mostrar _MENU_',
        search: 'Buscar',
        searchPlaceholder: 'Buscar...'
      },
      buttons: [
        {
          text: 'Agregar Categoría',
          className: 'add-new btn btn-primary mt-50',
          attr: {
            'data-bs-toggle': 'modal',
            'data-bs-target': '#addPermissionModal'
          },
          init: function (api, node, config) {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Detalles de la Categoría';
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== ''
                ? '<tr data-dt-row="' +
                col.rowIndex +
                '" data-dt-column="' +
                col.columnIndex +
                '">' +
                '<td>' +
                col.title +
                ':' +
                '</td> ' +
                '<td>' +
                col.data +
                '</td>' +
                '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      },
      language: {
        paginate: {
          previous: '&nbsp;',
          next: '&nbsp;'
        }
      }
    });
  }

  // Cargar datos en el formulario de edición al hacer clic en el botón de editar
  $('.datatables-permissions tbody').on('click', '.edit-record', function () {
    var $row = $(this).closest('tr');
    var rowData = dt_permission.row($row).data();

    $('#editTipoDeCategoria').val(rowData.tipo_de_categoria);
    $('#editNombre').val(rowData.nombre);
    $('#editDescripcion').val(rowData.descripcion);
    $('#editPermissionId').val(rowData.nombre); // Guardar el nombre del registro en un campo oculto
  });

  // Enviar el formulario de edición
  $('#editPermissionForm').on('submit', function (e) {
    e.preventDefault();

    // Obtener valores del formulario
    var tipoDeCategoria = $('#editTipoDeCategoria').val();
    var nombre = $('#editNombre').val();
    var descripcion = $('#editDescripcion').val();
    var nombreOriginal = $('#editPermissionId').val(); // Obtener el nombre del registro a actualizar

    // Actualizar el DataTable
    var updated = false;
    dt_permission.rows().every(function () {
      var data = this.data();
      if (data.nombre === nombreOriginal) { // Encontrar el registro con el nombre correspondiente
        data.tipo_de_categoria = tipoDeCategoria;
        data.nombre = nombre;
        data.descripcion = descripcion;
        this.data(data).draw(); // Actualizar los datos en la tabla
        updated = true;
        return false; // Salir del bucle
      }
    });

    if (!updated) {
      alert('No se encontró el registro para actualizar.');
    }

    // Limpiar el formulario y ocultar el modal
    $('#editPermissionForm')[0].reset();
    $('#editPermissionModal').modal('hide');
  });

  // Agregar nueva categoría
  $('#addPermissionForm').on('submit', function (e) {
    e.preventDefault();

    // Obtener valores del formulario
    var tipoDeCategoria = $('#modalTipoDeCategoria').val();
    var nombre = $('#modalNombre').val();
    var descripcion = $('#modalDescripcion').val();

    // Agregar nueva categoría al DataTable
    dt_permission.row.add({
      tipo_de_categoria: tipoDeCategoria,
      nombre: nombre,
      descripcion: descripcion
    }).draw();

    // Limpiar el formulario y ocultar el modal
    $('#addPermissionForm')[0].reset();
    $('#addPermissionModal').modal('hide');
  });

  // Eliminar registro
  $('.datatables-permissions tbody').on('click', '.delete-record', function () {
    if (typeof dt_permission !== 'undefined') {
      dt_permission.row($(this).parents('tr')).remove().draw();
    }
  });

  // Ajustar tamaño del control de formulario
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm');
    $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 300);
});
