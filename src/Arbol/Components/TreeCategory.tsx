interface TreeNode {
    level: number;
    code: string;
    name: string;
    children?: TreeNode[];
  }
  
 export const DataActivo: TreeNode[] = [
      {
        level: 1,
        code: '1',
        name: 'Activo',
        children: [
          {
            level: 2,
            code: '11',
            name: 'Efectivo y Equivalentes de Efectivo',
            children: [
              {
                level: 3,
                code: '1105',
                name: 'Caja',
                children: [
                  {
                    level: 4,
                    code: '110505',
                    name: 'Caja General',
                    children: [
                      { level: 5, code: '11050501', name: 'Caja Auxiliar 1' },
                      { level: 5, code: '11050502', name: 'Caja Cali' },
                      { level: 5, code: '11050506', name: 'Caja Medellín' },
                      { level: 5, code: '11050597', name: 'D. fiscal caja general' },
                    ],
                  },
                ],
              },
              {
                level: 3,
                code: '1110',
                name: 'Bancos',
                children: [
                  {
                    level: 5,
                    code: '111005',
                    name: 'Banco XYZ',
                    children: [
                      { level: 5, code: '11100501', name: 'Cuenta Corriente 1' },
                      { level: 5, code: '11100502', name: 'Cuenta Corriente 2' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            level: 2,
            code: '12',
            name: 'Inversiones',
            children: [
              {
                level: 3,
                code: '1205',
                name: 'Inversiones en acciones',
                children: [
                  {
                    level: 4,
                    code: '120505',
                    name: 'Acciones en empresas',
                    children: [
                      { level: 5, code: '12050501', name: 'Acciones ordinarias' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

 export const DataPasivo: TreeNode[] = [
    {
      level: 1,
      code: '2',
      name: 'Pasivo',
      children: [
        {
          level: 2,
          code: '21',
          name: 'Pasivo Corriente',
          children: [
            {
              level: 3,
              code: '2105',
              name: 'Obligaciones Financieras',
              children: [
                {
                  level: 4,
                  code: '210505',
                  name: 'Préstamos Bancarios',
                  children: [
                    { level: 5, code: '21050501', name: 'Préstamo Banco Nacional' },
                    { level: 5, code: '21050502', name: 'Préstamo Banco Internacional' },
                  ],
                },
              ],
            },
            {
              level: 3,
              code: '2110',
              name: 'Cuentas por Pagar',
              children: [
                {
                  level: 4,
                  code: '211005',
                  name: 'Proveedores Nacionales',
                  children: [
                    { level: 5, code: '21100501', name: 'Proveedores Nacionales A' },
                    { level: 5, code: '21100502', name: 'Proveedores Nacionales B' },
                  ],
                },
                {
                  level: 4,
                  code: '211010',
                  name: 'Proveedores Internacionales',
                  children: [
                    { level: 5, code: '21101001', name: 'Proveedores Internacionales A' },
                    { level: 5, code: '21101002', name: 'Proveedores Internacionales B' },
                  ],
                },
              ],
            },
          ],
        },
        {
          level: 2,
          code: '22',
          name: 'Pasivo No Corriente',
          children: [
            {
              level: 3,
              code: '2205',
              name: 'Obligaciones a Largo Plazo',
              children: [
                {
                  level: 4,
                  code: '220505',
                  name: 'Préstamos Hipotecarios',
                  children: [
                    { level: 5, code: '22050501', name: 'Hipoteca Banco Nacional' },
                    { level: 5, code: '22050502', name: 'Hipoteca Banco Internacional' },
                  ],
                },
              ],
            },
            {
              level: 3,
              code: '2210',
              name: 'Provisiones a Largo Plazo',
              children: [
                {
                  level: 4,
                  code: '221005',
                  name: 'Provisión para Pérdidas',
                  children: [
                    { level: 5, code: '22100501', name: 'Provisión por Deudas Incobrables' },
                    { level: 5, code: '22100502', name: 'Provisión para Litigios' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  