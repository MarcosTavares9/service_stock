import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ─── DataSource ─────────────────────────────────────────────────────────────

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'Stock_Control',
  logging: false,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

interface Mov {
  type: 'entry' | 'exit' | 'adjustment';
  qty: number;
  date: string;
  obs: string;
}

function buildHistory(
  productId: string,
  userId: string,
  categoryId: string,
  locationId: string,
  movements: Mov[],
): string[] {
  const sqls: string[] = [];
  let current = 0;
  for (const m of movements) {
    const prev = current;
    if (m.type === 'entry') current += m.qty;
    else if (m.type === 'exit') current -= m.qty;
    else current = m.qty;
    const delta = m.type === 'adjustment' ? Math.abs(current - prev) : m.qty;
    sqls.push(
      `INSERT INTO history (uuid, type, product_id, user_id, categories_id, locations_id, quantity_changed, previous_quantity, new_quantity, observation, status, created_at)` +
      ` VALUES (gen_random_uuid(), '${m.type}', '${productId}', '${userId}', '${categoryId}', '${locationId}',` +
      ` ${delta}, ${prev}, ${current}, '${esc(m.obs)}', 'true', '${m.date}')`,
    );
  }
  return sqls;
}

// ─── Images ─────────────────────────────────────────────────────────────────

const IMG = {
  drill:        'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&fit=crop&auto=format',
  drill2:       'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?w=400&fit=crop&auto=format',
  saw:          'https://images.unsplash.com/photo-1689935421853-cb23a0bc92e4?w=400&fit=crop&auto=format',
  grinder:      'https://images.unsplash.com/photo-1598302936625-6075fbd98dd7?w=400&fit=crop&auto=format',
  scaffolding:  'https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=400&fit=crop&auto=format',
  scaffolding2: 'https://images.unsplash.com/photo-1603239564387-c5b5ea6f635e?w=400&fit=crop&auto=format',
  hardhat:      'https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc?w=400&fit=crop&auto=format',
  worker:       'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&fit=crop&auto=format',
  cement:       'https://images.unsplash.com/photo-1575493438282-4e0fb32d1bdd?w=400&fit=crop&auto=format',
  cement2:      'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=400&fit=crop&auto=format',
  wire:         'https://images.unsplash.com/photo-1518181835702-6eef8b4b2113?w=400&fit=crop&auto=format',
  paint:        'https://images.unsplash.com/photo-1759330806091-b9a077491cc1?w=400&fit=crop&auto=format',
  pipes:        'https://images.unsplash.com/photo-1737574990049-264694ce17a0?w=400&fit=crop&auto=format',
  compressor:   'https://images.unsplash.com/photo-1655165312002-9d781ad4046e?w=400&fit=crop&auto=format',
};

// ─── Fixed UUIDs (somente hex válidos) ───────────────────────────────────────

// User
const USER_ID = '00000000-0000-0000-0000-000000000001';

// Categories  (namespace aaaa)
const CAT_MAO      = '00000001-0000-0000-aaaa-000000000001';
const CAT_ELETRICA = '00000002-0000-0000-aaaa-000000000001';
const CAT_MEDICAO  = '00000003-0000-0000-aaaa-000000000001';
const CAT_EPI      = '00000004-0000-0000-aaaa-000000000001';
const CAT_ALVEN    = '00000005-0000-0000-aaaa-000000000001';
const CAT_HIDRAUL  = '00000006-0000-0000-aaaa-000000000001';
const CAT_ELETRICO = '00000007-0000-0000-aaaa-000000000001';
const CAT_TINTA    = '00000008-0000-0000-aaaa-000000000001';
const CAT_FIXACAO  = '00000009-0000-0000-aaaa-000000000001';
const CAT_MADEIRA  = '0000000a-0000-0000-aaaa-000000000001';
const CAT_ARGAM    = '0000000b-0000-0000-aaaa-000000000001';
const CAT_IMPERM   = '0000000c-0000-0000-aaaa-000000000001';

// Locations (namespace bbbb)
const LOC_OBRA1    = '00000001-0000-0000-bbbb-000000000001';
const LOC_OBRA2    = '00000002-0000-0000-bbbb-000000000001';
const LOC_OBRA3    = '00000003-0000-0000-bbbb-000000000001';
const LOC_OBRA4    = '00000004-0000-0000-bbbb-000000000001';
const LOC_ARMAZEM  = '00000005-0000-0000-bbbb-000000000001';
const LOC_ALMOX1   = '00000006-0000-0000-bbbb-000000000001';
const LOC_ALMOX2   = '00000007-0000-0000-bbbb-000000000001';
const LOC_DEPOSITO = '00000008-0000-0000-bbbb-000000000001';

// Products - Ferramentas (namespace cccc)
const P_FURADEIRA    = '00000001-0000-0000-cccc-000000000001';
const P_MARTELETE    = '00000002-0000-0000-cccc-000000000001';
const P_SERRA_CIRC   = '00000003-0000-0000-cccc-000000000001';
const P_SERRA_TICO   = '00000004-0000-0000-cccc-000000000001'; // EMPTY
const P_ESMERILA     = '00000005-0000-0000-cccc-000000000001';
const P_PARAFUS      = '00000006-0000-0000-cccc-000000000001'; // LOW
const P_NIVEL_LASER  = '00000007-0000-0000-cccc-000000000001';
const P_TRENA        = '00000008-0000-0000-cccc-000000000001'; // EMPTY
const P_BETONEIRA    = '00000009-0000-0000-cccc-000000000001';
const P_COMPACT      = '0000000a-0000-0000-cccc-000000000001';
const P_PLAINA       = '0000000b-0000-0000-cccc-000000000001';
const P_LIXADEIRA    = '0000000c-0000-0000-cccc-000000000001';
const P_SOPRADOR     = '0000000d-0000-0000-cccc-000000000001'; // EMPTY
const P_MOTOBOMBA    = '0000000e-0000-0000-cccc-000000000001';
const P_COMPRESSOR   = '0000000f-0000-0000-cccc-000000000001';
const P_VIBRADOR     = '00000010-0000-0000-cccc-000000000001';
const P_ANDAIME      = '00000011-0000-0000-cccc-000000000001';
const P_ESCADA       = '00000012-0000-0000-cccc-000000000001';
const P_TALHA        = '00000013-0000-0000-cccc-000000000001';
const P_GERADOR      = '00000014-0000-0000-cccc-000000000001'; // EMPTY
const P_SERRA_FITA   = '00000015-0000-0000-cccc-000000000001';
const P_PONTEIRA     = '00000016-0000-0000-cccc-000000000001'; // LOW
const P_POLITRIZ     = '00000017-0000-0000-cccc-000000000001';
const P_FURAD_BANC   = '00000018-0000-0000-cccc-000000000001';
const P_ROCADEIRA    = '00000019-0000-0000-cccc-000000000001';

// Products - Materiais (continuação cccc)
const P_CIMENTO      = '0000001a-0000-0000-cccc-000000000001'; // LOW
const P_AREIA        = '0000001b-0000-0000-cccc-000000000001'; // LOW
const P_BRITA        = '0000001c-0000-0000-cccc-000000000001';
const P_BLOCO        = '0000001d-0000-0000-cccc-000000000001'; // LOW
const P_TIJOLO       = '0000001e-0000-0000-cccc-000000000001';
const P_CAL          = '0000001f-0000-0000-cccc-000000000001';
const P_ARGAM_ASSENT = '00000020-0000-0000-cccc-000000000001'; // EMPTY
const P_ARGAM_REVEST = '00000021-0000-0000-cccc-000000000001';
const P_VERGALHAO    = '00000022-0000-0000-cccc-000000000001'; // LOW
const P_TELA_SOLD    = '00000023-0000-0000-cccc-000000000001';
const P_TUBO100      = '00000024-0000-0000-cccc-000000000001';
const P_TUBO50       = '00000025-0000-0000-cccc-000000000001'; // EMPTY
const P_JOELHO       = '00000026-0000-0000-cccc-000000000001';
const P_REGISTRO     = '00000027-0000-0000-cccc-000000000001'; // EMPTY
const P_CABO         = '00000028-0000-0000-cccc-000000000001'; // LOW
const P_DISJUNTOR    = '00000029-0000-0000-cccc-000000000001';
const P_TOMADA       = '0000002a-0000-0000-cccc-000000000001';
const P_INTERRUPTOR  = '0000002b-0000-0000-cccc-000000000001';
const P_TINTA_BR     = '0000002c-0000-0000-cccc-000000000001';
const P_TINTA_EP     = '0000002d-0000-0000-cccc-000000000001'; // LOW
const P_SELADOR      = '0000002e-0000-0000-cccc-000000000001';
const P_MASSA_CORR   = '0000002f-0000-0000-cccc-000000000001'; // LOW
const P_PREGO        = '00000030-0000-0000-cccc-000000000001';
const P_PARAF_M8     = '00000031-0000-0000-cccc-000000000001';
const P_BUCHA        = '00000032-0000-0000-cccc-000000000001'; // LOW
const P_CHUMBADOR    = '00000033-0000-0000-cccc-000000000001'; // EMPTY
const P_MANTA        = '00000034-0000-0000-cccc-000000000001'; // LOW
const P_IMPERM       = '00000035-0000-0000-cccc-000000000001';
const P_COMPENSADO   = '00000036-0000-0000-cccc-000000000001';
const P_LONA         = '00000037-0000-0000-cccc-000000000001';
const P_CAPACETE     = '00000038-0000-0000-cccc-000000000001';
const P_LUVA         = '00000039-0000-0000-cccc-000000000001'; // LOW
const P_OCULOS       = '0000003a-0000-0000-cccc-000000000001';
const P_CINTO        = '0000003b-0000-0000-cccc-000000000001'; // LOW
const P_BOTA         = '0000003c-0000-0000-cccc-000000000001'; // EMPTY

// ─── Seed ────────────────────────────────────────────────────────────────────

async function seed() {
  await ds.initialize();
  console.log('🔌 Conectado ao banco de dados PostgreSQL');

  const qr = ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    // ── 1. USUÁRIO ADMINISTRADOR ────────────────────────────────────────────
    const passwordHash = await bcrypt.hash('Stock@2025', 10);
    await qr.query(
      `INSERT INTO users (id, name, last_name, email, password_hash, phone, role, status, email_confirmed, created_at, updated_at)` +
      ` VALUES ('${USER_ID}', 'João', 'Rabelo', 'mvfrt9805@gmail.com', '${passwordHash}',` +
      ` '(11) 99999-0001', 'Administrador', 'ativo', true, '2025-05-01', '2025-05-01')` +
      ` ON CONFLICT (email) DO NOTHING`,
    );

    const [existingUser] = await qr.query(`SELECT id FROM users WHERE email = 'mvfrt9805@gmail.com'`);
    const uid: string = existingUser?.id ?? USER_ID;
    console.log(`✅ Usuário: mvfrt9805@gmail.com (id: ${uid})`);

    // ── 2. CATEGORIAS (12) ─────────────────────────────────────────────────
    const categories = [
      { id: CAT_MAO,      name: 'Ferramentas de Mão',      icon: 'hammer'      },
      { id: CAT_ELETRICA, name: 'Ferramentas Elétricas',    icon: 'bolt'        },
      { id: CAT_MEDICAO,  name: 'Ferramentas de Medição',   icon: 'ruler'       },
      { id: CAT_EPI,      name: 'EPI',                      icon: 'hardhat'     },
      { id: CAT_ALVEN,    name: 'Materiais de Alvenaria',   icon: 'building'    },
      { id: CAT_HIDRAUL,  name: 'Materiais Hidráulicos',    icon: 'faucet'      },
      { id: CAT_ELETRICO, name: 'Materiais Elétricos',      icon: 'plug'        },
      { id: CAT_TINTA,    name: 'Tintas e Revestimentos',   icon: 'paint'       },
      { id: CAT_FIXACAO,  name: 'Fixação e Ancoragem',      icon: 'screwdriver' },
      { id: CAT_MADEIRA,  name: 'Madeira e Formas',         icon: 'tree'        },
      { id: CAT_ARGAM,    name: 'Argamassas e Cimentos',    icon: 'industry'    },
      { id: CAT_IMPERM,   name: 'Impermeabilização',        icon: 'umbrella'    },
    ];
    for (const c of categories) {
      await qr.query(
        `INSERT INTO categories (uuid, name, user_id, icon_name, status, created_at, updated_at)` +
        ` VALUES ('${c.id}', '${esc(c.name)}', '${uid}', '${c.icon}', 'true', '2025-05-15', '2025-05-15')` +
        ` ON CONFLICT (name, user_id) DO NOTHING`,
      );
    }
    console.log(`✅ Categorias inseridas (${categories.length})`);

    // ── 3. LOCALIZAÇÕES (8) ────────────────────────────────────────────────
    const locations = [
      { id: LOC_OBRA1,    name: 'Obra 1 - Residencial Jardim das Flores',  desc: 'Construção de residência unifamiliar - Jardim das Flores, São Paulo/SP'           },
      { id: LOC_OBRA2,    name: 'Obra 2 - Comercial Centro Empresarial',   desc: 'Construção de edifício comercial 8 andares - Centro Empresarial, Campinas/SP'     },
      { id: LOC_OBRA3,    name: 'Obra 3 - Industrial Galpão Logístico',    desc: 'Construção de galpão industrial 2.000m² - Polo Industrial, Jundiaí/SP'            },
      { id: LOC_OBRA4,    name: 'Obra 4 - Reforma Escola Municipal',       desc: 'Reforma e ampliação de escola municipal - Bairro Esperança, Guarulhos/SP'         },
      { id: LOC_ARMAZEM,  name: 'Armazém Central',                         desc: 'Depósito central de materiais, ferramentas e insumos da empresa'                  },
      { id: LOC_ALMOX1,   name: 'Almoxarifado Obra 1',                     desc: 'Almoxarifado local da Obra 1 - Jardim das Flores'                                  },
      { id: LOC_ALMOX2,   name: 'Almoxarifado Obra 2',                     desc: 'Almoxarifado local da Obra 2 - Centro Empresarial'                                 },
      { id: LOC_DEPOSITO, name: 'Depósito de Equipamentos',                desc: 'Depósito para equipamentos pesados, geradores e ferramentas de grande porte'       },
    ];
    for (const l of locations) {
      await qr.query(
        `INSERT INTO locations (uuid, name, user_id, description, status, created_at, updated_at)` +
        ` VALUES ('${l.id}', '${esc(l.name)}', '${uid}', '${esc(l.desc)}', 'true', '2025-05-15', '2025-05-15')` +
        ` ON CONFLICT (name, user_id) DO NOTHING`,
      );
    }
    console.log(`✅ Localizações inseridas (${locations.length})`);

    // ── 4. PRODUTOS (60) ───────────────────────────────────────────────────
    interface Prod {
      id: string; name: string; cat: string; loc: string;
      qty: number; min: number; status: string; img: string | null;
    }

    const products: Prod[] = [
      // ── FERRAMENTAS (25) ─────────────────────────────────────────────────
      { id: P_FURADEIRA,   name: 'Furadeira de Impacto 750W',          cat: CAT_ELETRICA, loc: LOC_OBRA1,    qty: 2,   min: 1,   status: 'ok',    img: IMG.drill        },
      { id: P_MARTELETE,   name: 'Martelete Demolidor 5kg SDS-Plus',   cat: CAT_ELETRICA, loc: LOC_ARMAZEM,  qty: 1,   min: 1,   status: 'ok',    img: IMG.drill2       },
      { id: P_SERRA_CIRC,  name: 'Serra Circular 7¼" 1.800W',          cat: CAT_ELETRICA, loc: LOC_OBRA2,    qty: 1,   min: 1,   status: 'ok',    img: IMG.saw          },
      { id: P_SERRA_TICO,  name: 'Serra Tico-Tico 650W',               cat: CAT_ELETRICA, loc: LOC_OBRA3,    qty: 0,   min: 1,   status: 'empty', img: IMG.saw          },
      { id: P_ESMERILA,    name: 'Esmerilhadeira Angular 4½" 900W',    cat: CAT_ELETRICA, loc: LOC_OBRA1,    qty: 1,   min: 1,   status: 'ok',    img: IMG.grinder      },
      { id: P_PARAFUS,     name: 'Parafusadeira a Bateria 18V',        cat: CAT_ELETRICA, loc: LOC_OBRA2,    qty: 1,   min: 2,   status: 'low',   img: IMG.drill        },
      { id: P_NIVEL_LASER, name: 'Nível a Laser GLL 30',              cat: CAT_MEDICAO,  loc: LOC_ALMOX1,   qty: 2,   min: 1,   status: 'ok',    img: IMG.drill2       },
      { id: P_TRENA,       name: 'Trena Digital 50m',                  cat: CAT_MEDICAO,  loc: LOC_OBRA3,    qty: 0,   min: 1,   status: 'empty', img: null             },
      { id: P_BETONEIRA,   name: 'Betoneira 400L 1HP',                 cat: CAT_ELETRICA, loc: LOC_ARMAZEM,  qty: 1,   min: 1,   status: 'ok',    img: IMG.worker       },
      { id: P_COMPACT,     name: 'Compactador de Solo 6,5HP',          cat: CAT_ELETRICA, loc: LOC_OBRA3,    qty: 1,   min: 1,   status: 'ok',    img: IMG.worker       },
      { id: P_PLAINA,      name: 'Plaina Elétrica 1.100W',             cat: CAT_ELETRICA, loc: LOC_ALMOX2,   qty: 1,   min: 1,   status: 'ok',    img: IMG.drill2       },
      { id: P_LIXADEIRA,   name: 'Lixadeira Orbital 300W',             cat: CAT_ELETRICA, loc: LOC_OBRA1,    qty: 2,   min: 1,   status: 'ok',    img: IMG.grinder      },
      { id: P_SOPRADOR,    name: 'Soprador Térmico 2.000W',            cat: CAT_ELETRICA, loc: LOC_ARMAZEM,  qty: 0,   min: 1,   status: 'empty', img: null             },
      { id: P_MOTOBOMBA,   name: "Moto Bomba d'Água 1,5HP",            cat: CAT_ELETRICA, loc: LOC_OBRA2,    qty: 1,   min: 1,   status: 'ok',    img: IMG.compressor   },
      { id: P_COMPRESSOR,  name: 'Compressor de Ar 50L 2HP',           cat: CAT_ELETRICA, loc: LOC_OBRA1,    qty: 1,   min: 1,   status: 'ok',    img: IMG.compressor   },
      { id: P_VIBRADOR,    name: 'Vibrador de Concreto 1,5HP',         cat: CAT_ELETRICA, loc: LOC_OBRA3,    qty: 1,   min: 1,   status: 'ok',    img: IMG.worker       },
      { id: P_ANDAIME,     name: 'Andaime Tubular 4x3m (kit)',         cat: CAT_MAO,      loc: LOC_ALMOX1,   qty: 3,   min: 2,   status: 'ok',    img: IMG.scaffolding  },
      { id: P_ESCADA,      name: 'Escada Extensível 6m Alumínio',      cat: CAT_MAO,      loc: LOC_ARMAZEM,  qty: 2,   min: 1,   status: 'ok',    img: IMG.scaffolding2 },
      { id: P_TALHA,       name: 'Talha Manual 2000kg',                cat: CAT_MAO,      loc: LOC_DEPOSITO, qty: 1,   min: 1,   status: 'ok',    img: null             },
      { id: P_GERADOR,     name: 'Gerador de Energia 6kVA',            cat: CAT_ELETRICA, loc: LOC_OBRA2,    qty: 0,   min: 1,   status: 'empty', img: IMG.compressor   },
      { id: P_SERRA_FITA,  name: 'Serra Fita 350mm 750W',              cat: CAT_ELETRICA, loc: LOC_ALMOX2,   qty: 1,   min: 1,   status: 'ok',    img: IMG.saw          },
      { id: P_PONTEIRA,    name: 'Ponteira SDS 40cm (caixa 10un)',     cat: CAT_MAO,      loc: LOC_DEPOSITO, qty: 3,   min: 5,   status: 'low',   img: IMG.drill2       },
      { id: P_POLITRIZ,    name: 'Politriz Angular 7" 2.200W',         cat: CAT_ELETRICA, loc: LOC_OBRA3,    qty: 1,   min: 1,   status: 'ok',    img: IMG.grinder      },
      { id: P_FURAD_BANC,  name: 'Furadeira de Bancada 5/8"',          cat: CAT_ELETRICA, loc: LOC_ARMAZEM,  qty: 1,   min: 1,   status: 'ok',    img: IMG.drill        },
      { id: P_ROCADEIRA,   name: 'Roçadeira a Gasolina 52cc',          cat: CAT_ELETRICA, loc: LOC_OBRA4,    qty: 1,   min: 1,   status: 'ok',    img: IMG.grinder      },

      // ── MATERIAIS (35) ───────────────────────────────────────────────────
      { id: P_CIMENTO,     name: 'Cimento CP-II 50kg',                 cat: CAT_ARGAM,    loc: LOC_OBRA1,    qty: 45,  min: 100, status: 'low',   img: IMG.cement       },
      { id: P_AREIA,       name: 'Areia Média (m³)',                    cat: CAT_ALVEN,    loc: LOC_ALMOX1,   qty: 8,   min: 10,  status: 'low',   img: IMG.cement2      },
      { id: P_BRITA,       name: 'Brita nº1 (m³)',                      cat: CAT_ALVEN,    loc: LOC_OBRA3,    qty: 12,  min: 5,   status: 'ok',    img: IMG.cement2      },
      { id: P_BLOCO,       name: 'Bloco Cerâmico 14x19x29',            cat: CAT_ALVEN,    loc: LOC_OBRA1,    qty: 320, min: 500, status: 'low',   img: IMG.cement2      },
      { id: P_TIJOLO,      name: 'Tijolo Maciço (un)',                  cat: CAT_ALVEN,    loc: LOC_OBRA2,    qty: 800, min: 200, status: 'ok',    img: IMG.cement2      },
      { id: P_CAL,         name: 'Cal Hidratada 20kg',                  cat: CAT_ARGAM,    loc: LOC_ARMAZEM,  qty: 35,  min: 20,  status: 'ok',    img: IMG.cement       },
      { id: P_ARGAM_ASSENT,name: 'Argamassa de Assentamento 20kg',      cat: CAT_ARGAM,    loc: LOC_OBRA2,    qty: 0,   min: 30,  status: 'empty', img: IMG.cement       },
      { id: P_ARGAM_REVEST,name: 'Argamassa de Revestimento 25kg',      cat: CAT_ARGAM,    loc: LOC_ALMOX2,   qty: 45,  min: 20,  status: 'ok',    img: IMG.cement       },
      { id: P_VERGALHAO,   name: 'Vergalhão CA-50 10mm (barra)',        cat: CAT_ALVEN,    loc: LOC_OBRA3,    qty: 28,  min: 50,  status: 'low',   img: IMG.worker       },
      { id: P_TELA_SOLD,   name: 'Tela Soldada Q-92 (m²)',              cat: CAT_ALVEN,    loc: LOC_OBRA3,    qty: 15,  min: 10,  status: 'ok',    img: IMG.worker       },
      { id: P_TUBO100,     name: 'Tubo PVC 100mm (barra 6m)',           cat: CAT_HIDRAUL,  loc: LOC_OBRA1,    qty: 32,  min: 20,  status: 'ok',    img: IMG.pipes        },
      { id: P_TUBO50,      name: 'Tubo PVC 50mm (barra 6m)',            cat: CAT_HIDRAUL,  loc: LOC_OBRA2,    qty: 0,   min: 15,  status: 'empty', img: IMG.pipes        },
      { id: P_JOELHO,      name: 'Joelho 90° PVC 100mm',                cat: CAT_HIDRAUL,  loc: LOC_ARMAZEM,  qty: 22,  min: 10,  status: 'ok',    img: IMG.pipes        },
      { id: P_REGISTRO,    name: 'Registro de Gaveta 1½"',              cat: CAT_HIDRAUL,  loc: LOC_ALMOX1,   qty: 0,   min: 5,   status: 'empty', img: IMG.pipes        },
      { id: P_CABO,        name: 'Cabo Elétrico 2,5mm² (metro)',        cat: CAT_ELETRICO, loc: LOC_OBRA1,    qty: 60,  min: 100, status: 'low',   img: IMG.wire         },
      { id: P_DISJUNTOR,   name: 'Disjuntor Bipolar 20A',               cat: CAT_ELETRICO, loc: LOC_OBRA2,    qty: 18,  min: 10,  status: 'ok',    img: IMG.wire         },
      { id: P_TOMADA,      name: 'Tomada 2P+T',                         cat: CAT_ELETRICO, loc: LOC_ARMAZEM,  qty: 45,  min: 20,  status: 'ok',    img: IMG.wire         },
      { id: P_INTERRUPTOR, name: 'Interruptor Simples',                  cat: CAT_ELETRICO, loc: LOC_ALMOX2,   qty: 12,  min: 10,  status: 'ok',    img: IMG.wire         },
      { id: P_TINTA_BR,    name: 'Tinta Acrílica Branca 18L',           cat: CAT_TINTA,    loc: LOC_OBRA2,    qty: 8,   min: 5,   status: 'ok',    img: IMG.paint        },
      { id: P_TINTA_EP,    name: 'Tinta Epóxi Cinza 3,6L',             cat: CAT_TINTA,    loc: LOC_DEPOSITO, qty: 2,   min: 5,   status: 'low',   img: IMG.paint        },
      { id: P_SELADOR,     name: 'Selador Acrílico 18L',                cat: CAT_TINTA,    loc: LOC_ARMAZEM,  qty: 5,   min: 3,   status: 'ok',    img: IMG.paint        },
      { id: P_MASSA_CORR,  name: 'Massa Corrida PVA 25kg',              cat: CAT_TINTA,    loc: LOC_OBRA1,    qty: 6,   min: 10,  status: 'low',   img: IMG.paint        },
      { id: P_PREGO,       name: 'Pregos 2½x10 (caixa 1kg)',            cat: CAT_FIXACAO,  loc: LOC_OBRA3,    qty: 25,  min: 10,  status: 'ok',    img: null             },
      { id: P_PARAF_M8,    name: 'Parafuso Sextavado M8x50 (caixa)',    cat: CAT_FIXACAO,  loc: LOC_ARMAZEM,  qty: 12,  min: 5,   status: 'ok',    img: null             },
      { id: P_BUCHA,       name: 'Bucha Fischer S8 (caixa 100un)',       cat: CAT_FIXACAO,  loc: LOC_ALMOX1,   qty: 4,   min: 10,  status: 'low',   img: null             },
      { id: P_CHUMBADOR,   name: 'Chumbador Expan 3/8"',                 cat: CAT_FIXACAO,  loc: LOC_OBRA2,    qty: 0,   min: 10,  status: 'empty', img: null             },
      { id: P_MANTA,       name: 'Manta Asfáltica 10m²',                cat: CAT_IMPERM,   loc: LOC_OBRA3,    qty: 2,   min: 5,   status: 'low',   img: null             },
      { id: P_IMPERM,      name: 'Impermeabilizante Vedacit 18kg',       cat: CAT_IMPERM,   loc: LOC_OBRA1,    qty: 7,   min: 3,   status: 'ok',    img: null             },
      { id: P_COMPENSADO,  name: 'Compensado Estrutural 15mm',           cat: CAT_MADEIRA,  loc: LOC_ALMOX2,   qty: 15,  min: 10,  status: 'ok',    img: null             },
      { id: P_LONA,        name: 'Lona Plástica 150 Micras (m²)',        cat: CAT_MADEIRA,  loc: LOC_OBRA3,    qty: 120, min: 50,  status: 'ok',    img: null             },
      { id: P_CAPACETE,    name: 'Capacete de Segurança',                cat: CAT_EPI,      loc: LOC_OBRA1,    qty: 15,  min: 10,  status: 'ok',    img: IMG.hardhat      },
      { id: P_LUVA,        name: 'Luva de Vaqueta',                      cat: CAT_EPI,      loc: LOC_OBRA2,    qty: 4,   min: 10,  status: 'low',   img: IMG.hardhat      },
      { id: P_OCULOS,      name: 'Óculos de Proteção',                   cat: CAT_EPI,      loc: LOC_ARMAZEM,  qty: 22,  min: 15,  status: 'ok',    img: IMG.hardhat      },
      { id: P_CINTO,       name: 'Cinto de Segurança Paraquedista',      cat: CAT_EPI,      loc: LOC_DEPOSITO, qty: 2,   min: 3,   status: 'low',   img: IMG.hardhat      },
      { id: P_BOTA,        name: 'Bota de PVC',                          cat: CAT_EPI,      loc: LOC_ALMOX2,   qty: 0,   min: 10,  status: 'empty', img: null             },
    ];

    for (const p of products) {
      const imgVal = p.img ? `'${p.img}'` : 'NULL';
      await qr.query(
        `INSERT INTO products (uuid, name, category_id, location_id, quantity, minimum_stock, stock_status, status, image, created_at, updated_at)` +
        ` VALUES ('${p.id}', '${esc(p.name)}', '${p.cat}', '${p.loc}', ${p.qty}, ${p.min}, '${p.status}', 'true', ${imgVal}, '2025-06-01', '2025-06-01')` +
        ` ON CONFLICT (uuid) DO NOTHING`,
      );
    }
    console.log(`✅ Produtos inseridos (${products.length}) — 25 ferramentas + 35 materiais`);

    // ── 5. HISTÓRICO DE MOVIMENTAÇÕES ──────────────────────────────────────
    // Período: 01/06/2025 a 02/05/2026
    // Tipos: entry (entrada), exit (saída), adjustment (ajuste de inventário)

    const allHistory: string[] = [

      // ════ FERRAMENTAS ════════════════════════════════════════════════════

      ...buildHistory(P_FURADEIRA, uid, CAT_ELETRICA, LOC_OBRA1, [
        { type: 'entry', qty: 3, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001001, fornecedor Bosch' },
        { type: 'exit',  qty: 1, date: '2025-07-10', obs: 'Saída para uso em Obra 3 — estrutura de concreto' },
        { type: 'entry', qty: 1, date: '2025-09-15', obs: 'Devolução de Obra 3 — etapa concluída' },
        { type: 'exit',  qty: 1, date: '2026-01-20', obs: 'Saída para Obra 4 — reforma escola municipal' },
      ]),

      ...buildHistory(P_MARTELETE, uid, CAT_ELETRICA, LOC_ARMAZEM, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001002, fornecedor DeWalt' },
        { type: 'exit',  qty: 1, date: '2025-08-20', obs: 'Retirada para Obra 2 — demolição de paredes internas' },
        { type: 'exit',  qty: 1, date: '2025-11-30', obs: 'Enviado para manutenção — desgaste excessivo no ponteiro' },
        { type: 'entry', qty: 1, date: '2026-01-15', obs: 'Retorno após manutenção preventiva — troca de escovas' },
      ]),

      ...buildHistory(P_SERRA_CIRC, uid, CAT_ELETRICA, LOC_OBRA2, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001003, fornecedor Makita' },
        { type: 'exit',  qty: 1, date: '2025-07-20', obs: 'Retirada para Obra 1 — corte de chapas de formas' },
      ]),

      ...buildHistory(P_SERRA_TICO, uid, CAT_ELETRICA, LOC_OBRA3, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001004' },
        { type: 'exit',  qty: 1, date: '2025-08-15', obs: 'Retirada para Obra 1 — acabamento carpintaria janelas' },
        { type: 'exit',  qty: 1, date: '2026-02-10', obs: 'Retirada para Obra 4 — reforma escola, não retornou' },
      ]),

      ...buildHistory(P_ESMERILA, uid, CAT_ELETRICA, LOC_OBRA1, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001005, fornecedor Bosch' },
        { type: 'exit',  qty: 1, date: '2025-09-10', obs: 'Retirada para Obra 2 — corte de metais e ferros' },
        { type: 'entry', qty: 1, date: '2025-11-05', obs: 'Devolução de Obra 2 — etapa de ferragem concluída' },
        { type: 'exit',  qty: 1, date: '2026-03-15', obs: 'Saída para Obra 3 — polimento de estrutura metálica' },
      ]),

      ...buildHistory(P_PARAFUS, uid, CAT_ELETRICA, LOC_OBRA2, [
        { type: 'entry', qty: 3, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001006, fornecedor Makita' },
        { type: 'exit',  qty: 1, date: '2025-07-25', obs: 'Retirada para Obra 3 — instalação de esquadrias' },
        { type: 'exit',  qty: 1, date: '2025-12-10', obs: 'Enviada para manutenção — bateria com vida útil baixa' },
      ]),

      ...buildHistory(P_NIVEL_LASER, uid, CAT_MEDICAO, LOC_ALMOX1, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001007, fornecedor Bosch' },
        { type: 'exit',  qty: 1, date: '2025-08-20', obs: 'Emprestado para Obra 1 — nivelamento da alvenaria' },
        { type: 'entry', qty: 1, date: '2025-10-15', obs: 'Devolução de Obra 1 — nivelamento concluído' },
      ]),

      ...buildHistory(P_TRENA, uid, CAT_MEDICAO, LOC_OBRA3, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001008' },
        { type: 'exit',  qty: 1, date: '2025-09-20', obs: 'Retirada para Obra 1 — medição de cômodos' },
        { type: 'exit',  qty: 1, date: '2026-01-08', obs: 'Extraviada em campo — instaurado processo de reposição' },
      ]),

      ...buildHistory(P_BETONEIRA, uid, CAT_ELETRICA, LOC_ARMAZEM, [
        { type: 'entry', qty: 1, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001009, fornecedor CSM' },
        { type: 'exit',  qty: 1, date: '2025-09-25', obs: 'Enviada para Obra 3 — concretagem dos pilares' },
        { type: 'entry', qty: 1, date: '2025-11-20', obs: 'Retorno ao armazém — Obra 3 concluiu concretagem' },
        { type: 'exit',  qty: 1, date: '2026-02-15', obs: 'Emprestada para Obra 4 — fundação escola' },
        { type: 'entry', qty: 1, date: '2026-04-10', obs: 'Devolução de Obra 4 — fundação concluída' },
      ]),

      ...buildHistory(P_COMPACT, uid, CAT_ELETRICA, LOC_OBRA3, [
        { type: 'entry', qty: 1, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001010' },
        { type: 'exit',  qty: 1, date: '2025-10-20', obs: 'Enviado para Obra 2 — terraplanagem do acesso' },
        { type: 'entry', qty: 1, date: '2026-01-10', obs: 'Retorno — Obra 2 concluiu terraplanagem' },
        { type: 'exit',  qty: 1, date: '2026-03-05', obs: 'Saída para Obra 3 — compactação do piso industrial' },
        { type: 'entry', qty: 1, date: '2026-04-20', obs: 'Retorno após conclusão da etapa de piso' },
      ]),

      ...buildHistory(P_PLAINA, uid, CAT_ELETRICA, LOC_ALMOX2, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001011' },
        { type: 'exit',  qty: 1, date: '2025-10-10', obs: 'Enviada para Obra 1 — acabamento em madeira das janelas' },
        { type: 'entry', qty: 1, date: '2026-02-20', obs: 'Devolução de Obra 1 — etapa de carpintaria encerrada' },
        { type: 'exit',  qty: 1, date: '2026-04-25', obs: 'Transferência para Obra 4 — reforma de portas escola' },
      ]),

      ...buildHistory(P_LIXADEIRA, uid, CAT_ELETRICA, LOC_OBRA1, [
        { type: 'entry', qty: 3, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001012' },
        { type: 'exit',  qty: 1, date: '2025-08-15', obs: 'Enviada para Obra 2 — acabamento interno paredes' },
        { type: 'entry', qty: 1, date: '2026-01-15', obs: 'Devolução de Obra 2 — acabamento concluído' },
        { type: 'exit',  qty: 1, date: '2026-03-10', obs: 'Retirada para Obra 3 — lixamento de piso epóxi' },
      ]),

      ...buildHistory(P_SOPRADOR, uid, CAT_ELETRICA, LOC_ARMAZEM, [
        { type: 'entry', qty: 1, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001013' },
        { type: 'exit',  qty: 1, date: '2025-07-20', obs: 'Enviado para Obra 1 — secagem de argamassa' },
        { type: 'entry', qty: 1, date: '2025-09-05', obs: 'Devolução de Obra 1' },
        { type: 'exit',  qty: 1, date: '2026-01-12', obs: 'Danificado por curto-circuito — aguardando descarte' },
      ]),

      ...buildHistory(P_MOTOBOMBA, uid, CAT_ELETRICA, LOC_OBRA2, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001014' },
        { type: 'exit',  qty: 1, date: '2025-07-10', obs: 'Retirada para Obra 3 — esgotamento de valas de fundação' },
        { type: 'entry', qty: 1, date: '2026-02-10', obs: 'Devolução de Obra 3 — valas concluídas' },
        { type: 'exit',  qty: 1, date: '2026-04-05', obs: 'Saída para Obra 1 — escoamento de águas pluviais' },
      ]),

      ...buildHistory(P_COMPRESSOR, uid, CAT_ELETRICA, LOC_OBRA1, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001015' },
        { type: 'exit',  qty: 1, date: '2025-10-15', obs: 'Enviado para Obra 3 — pintura pneumática piso' },
        { type: 'entry', qty: 1, date: '2026-02-01', obs: 'Retorno ao almoxarifado' },
        { type: 'exit',  qty: 1, date: '2026-04-15', obs: 'Saída para Obra 2 — ferragem e sopro' },
      ]),

      ...buildHistory(P_VIBRADOR, uid, CAT_ELETRICA, LOC_OBRA3, [
        { type: 'entry', qty: 1, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001016' },
        { type: 'exit',  qty: 1, date: '2025-08-20', obs: 'Enviado para Obra 2 — concretagem da laje cobertura' },
        { type: 'entry', qty: 1, date: '2025-10-10', obs: 'Devolução de Obra 2' },
        { type: 'exit',  qty: 1, date: '2026-01-25', obs: 'Saída para Obra 4 — fundação escola municipal' },
        { type: 'entry', qty: 1, date: '2026-03-20', obs: 'Devolução — Obra 4 concluiu a fundação' },
      ]),

      ...buildHistory(P_ANDAIME, uid, CAT_MAO, LOC_ALMOX1, [
        { type: 'entry', qty: 5, date: '2025-06-05', obs: 'Entrada inicial — 5 kits módulos NF 001017' },
        { type: 'exit',  qty: 1, date: '2025-07-15', obs: 'Saída 1 kit para Obra 1 — andaime de fachada' },
        { type: 'exit',  qty: 1, date: '2025-09-20', obs: 'Saída 1 kit para Obra 3 — estrutura metálica lateral' },
      ]),

      ...buildHistory(P_ESCADA, uid, CAT_MAO, LOC_ARMAZEM, [
        { type: 'entry', qty: 3, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001018' },
        { type: 'exit',  qty: 1, date: '2025-08-05', obs: 'Saída para Obra 2 — acesso entre andares' },
        { type: 'entry', qty: 1, date: '2025-12-15', obs: 'Devolução de Obra 2' },
        { type: 'exit',  qty: 1, date: '2026-02-25', obs: 'Saída para Obra 4 — acesso telhado escola' },
      ]),

      ...buildHistory(P_TALHA, uid, CAT_MAO, LOC_DEPOSITO, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001019' },
        { type: 'exit',  qty: 1, date: '2025-09-15', obs: 'Emprestada para Obra 3 — içamento de vigas metálicas' },
        { type: 'entry', qty: 1, date: '2026-01-20', obs: 'Devolução de Obra 3' },
        { type: 'exit',  qty: 1, date: '2026-04-10', obs: 'Saída para Obra 2 — içamento de equipamentos HVAC' },
      ]),

      ...buildHistory(P_GERADOR, uid, CAT_ELETRICA, LOC_OBRA2, [
        { type: 'entry', qty: 1, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001020, fornecedor Toyama' },
        { type: 'exit',  qty: 1, date: '2025-07-20', obs: 'Enviado para Obra 3 — energia provisória durante obra' },
        { type: 'entry', qty: 1, date: '2025-11-10', obs: 'Devolução de Obra 3 — energia elétrica regularizada' },
        { type: 'exit',  qty: 1, date: '2026-02-20', obs: 'Enviado para Obra 4 — reforma escola sem energia' },
      ]),

      ...buildHistory(P_SERRA_FITA, uid, CAT_ELETRICA, LOC_ALMOX2, [
        { type: 'entry', qty: 1, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001021' },
        { type: 'exit',  qty: 1, date: '2025-10-15', obs: 'Emprestada para Obra 1 — corte de MDF e madeira' },
        { type: 'entry', qty: 1, date: '2026-01-10', obs: 'Devolução de Obra 1' },
      ]),

      ...buildHistory(P_PONTEIRA, uid, CAT_MAO, LOC_DEPOSITO, [
        { type: 'entry', qty: 10, date: '2025-06-05', obs: 'Entrada inicial — caixa 10 ponteiras SDS NF 001022' },
        { type: 'exit',  qty: 2,  date: '2025-07-20', obs: 'Retirada para uso em Obra 1 — demolição de paredes' },
        { type: 'exit',  qty: 3,  date: '2025-09-10', obs: 'Retirada para Obra 3 — perfuração de concreto armado' },
        { type: 'exit',  qty: 2,  date: '2026-01-15', obs: 'Retirada para Obra 2 — instalações embutidas' },
      ]),

      ...buildHistory(P_POLITRIZ, uid, CAT_ELETRICA, LOC_OBRA3, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001023' },
        { type: 'exit',  qty: 1, date: '2025-08-25', obs: 'Enviada para Obra 1 — polimento de piso mármore' },
        { type: 'entry', qty: 1, date: '2026-03-15', obs: 'Devolução de Obra 1 — acabamento concluído' },
        { type: 'exit',  qty: 1, date: '2026-04-20', obs: 'Saída para Obra 2 — polimento de piso granito' },
      ]),

      ...buildHistory(P_FURAD_BANC, uid, CAT_ELETRICA, LOC_ARMAZEM, [
        { type: 'entry', qty: 1, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001024' },
        { type: 'exit',  qty: 1, date: '2025-11-20', obs: 'Enviada para manutenção — bucha e mandril desgastados' },
        { type: 'entry', qty: 1, date: '2026-02-05', obs: 'Retorno após manutenção preventiva' },
      ]),

      ...buildHistory(P_ROCADEIRA, uid, CAT_ELETRICA, LOC_OBRA4, [
        { type: 'entry', qty: 2, date: '2025-06-05', obs: 'Entrada inicial — compra NF 001025' },
        { type: 'exit',  qty: 1, date: '2025-08-10', obs: 'Enviada para Obra 3 — limpeza e manutenção de terreno' },
        { type: 'entry', qty: 1, date: '2025-11-25', obs: 'Devolução de Obra 3' },
        { type: 'exit',  qty: 1, date: '2026-03-10', obs: 'Saída para Obra 4 — limpeza área escolar' },
      ]),

      // ════ MATERIAIS ══════════════════════════════════════════════════════

      ...buildHistory(P_CIMENTO, uid, CAT_ARGAM, LOC_OBRA1, [
        { type: 'entry', qty: 200, date: '2025-06-01', obs: 'Compra inicial — NF 002001, fornecedor Votorantim 200 sacos' },
        { type: 'exit',  qty: 50,  date: '2025-07-15', obs: 'Consumo em fundação — sapatas e vigas baldrame' },
        { type: 'exit',  qty: 30,  date: '2025-08-10', obs: 'Consumo em estrutura — pilares e vigas' },
        { type: 'exit',  qty: 40,  date: '2025-09-05', obs: 'Consumo em alvenaria — assentamento de blocos' },
        { type: 'entry', qty: 100, date: '2025-10-20', obs: 'Reposição — NF 002100 100 sacos, fornecedor Cauê' },
        { type: 'exit',  qty: 80,  date: '2025-11-10', obs: 'Consumo em contrapiso e reboco interno' },
        { type: 'exit',  qty: 30,  date: '2025-12-15', obs: 'Consumo em acabamento — calçadas e passeio' },
        { type: 'exit',  qty: 25,  date: '2026-01-10', obs: 'Transferência para uso em Obra 4 — fundação escola' },
      ]),

      ...buildHistory(P_AREIA, uid, CAT_ALVEN, LOC_ALMOX1, [
        { type: 'entry', qty: 20, date: '2025-06-01', obs: 'Compra inicial — 20m³ fornecedor Souza & Cia Areias' },
        { type: 'exit',  qty: 5,  date: '2025-07-20', obs: 'Uso em argamassa — assentamento Obra 1' },
        { type: 'exit',  qty: 4,  date: '2025-08-15', obs: 'Uso em reboco externo fachada' },
        { type: 'exit',  qty: 3,  date: '2025-09-20', obs: 'Uso em contrapiso — área de serviços' },
      ]),

      ...buildHistory(P_BRITA, uid, CAT_ALVEN, LOC_OBRA3, [
        { type: 'entry', qty: 15, date: '2025-06-01', obs: 'Compra inicial — 15m³ Mineração Jundiaiense' },
        { type: 'exit',  qty: 3,  date: '2025-07-10', obs: 'Uso em fundação — Obra 3 galpão industrial' },
      ]),

      ...buildHistory(P_BLOCO, uid, CAT_ALVEN, LOC_OBRA1, [
        { type: 'entry', qty: 1000, date: '2025-06-01', obs: 'Compra inicial — 1000 unidades NF 002004' },
        { type: 'exit',  qty: 200,  date: '2025-07-01', obs: 'Uso em paredes — 1° pavimento área social' },
        { type: 'exit',  qty: 300,  date: '2025-08-01', obs: 'Continuação alvenaria — paredes internas quartos' },
        { type: 'exit',  qty: 180,  date: '2025-09-01', obs: 'Alvenaria 2° pavimento — suíte e banheiro' },
      ]),

      ...buildHistory(P_TIJOLO, uid, CAT_ALVEN, LOC_OBRA2, [
        { type: 'entry', qty: 1500, date: '2025-06-01', obs: 'Compra inicial — 1500 unidades NF 002005' },
        { type: 'exit',  qty: 300,  date: '2025-07-20', obs: 'Uso em calçadas e muros externos' },
        { type: 'exit',  qty: 200,  date: '2025-08-20', obs: 'Muros de divisa e tapumes' },
        { type: 'exit',  qty: 200,  date: '2025-10-10', obs: 'Complemento de alvenaria Obra 2' },
      ]),

      ...buildHistory(P_CAL, uid, CAT_ARGAM, LOC_ARMAZEM, [
        { type: 'entry', qty: 50, date: '2025-06-01', obs: 'Compra inicial — 50 sacos NF 002006' },
        { type: 'exit',  qty: 20, date: '2025-08-10', obs: 'Uso em reboco — Obra 1 fachada externa' },
        { type: 'entry', qty: 25, date: '2025-10-15', obs: 'Reposição — NF 002206' },
        { type: 'exit',  qty: 20, date: '2025-12-10', obs: 'Uso em argamassa de revestimento interno' },
      ]),

      ...buildHistory(P_ARGAM_ASSENT, uid, CAT_ARGAM, LOC_OBRA2, [
        { type: 'entry', qty: 80, date: '2025-06-01', obs: 'Compra inicial — 80 sacos NF 002007' },
        { type: 'exit',  qty: 30, date: '2025-07-10', obs: 'Assentamento de blocos — paredes externas' },
        { type: 'exit',  qty: 50, date: '2025-08-15', obs: 'Conclusão alvenaria — estoque esgotado, pedido pendente' },
      ]),

      ...buildHistory(P_ARGAM_REVEST, uid, CAT_ARGAM, LOC_ALMOX2, [
        { type: 'entry', qty: 60, date: '2025-06-15', obs: 'Compra inicial — NF 002008' },
        { type: 'exit',  qty: 15, date: '2025-09-10', obs: 'Revestimento externo — fachada principal Obra 2' },
      ]),

      ...buildHistory(P_VERGALHAO, uid, CAT_ALVEN, LOC_OBRA3, [
        { type: 'entry', qty: 100, date: '2025-06-01', obs: 'Compra inicial — 100 barras NF 002009, Aço Brasil Ltda' },
        { type: 'exit',  qty: 30,  date: '2025-07-05', obs: 'Uso em fundação — pilares e estacas Obra 3' },
        { type: 'exit',  qty: 20,  date: '2025-08-10', obs: 'Vigas e lajes — estrutura principal galpão' },
        { type: 'exit',  qty: 22,  date: '2025-11-15', obs: 'Estrutura mezanino — 2° nível galpão' },
      ]),

      ...buildHistory(P_TELA_SOLD, uid, CAT_ALVEN, LOC_OBRA3, [
        { type: 'entry', qty: 20, date: '2025-06-01', obs: 'Compra inicial — 20m² NF 002010' },
        { type: 'exit',  qty: 5,  date: '2025-08-20', obs: 'Contrapiso térreo — área do galpão Obra 3' },
      ]),

      ...buildHistory(P_TUBO100, uid, CAT_HIDRAUL, LOC_OBRA1, [
        { type: 'entry', qty: 50, date: '2025-06-01', obs: 'Compra inicial — 50 barras 6m NF 002011' },
        { type: 'exit',  qty: 18, date: '2025-07-25', obs: 'Instalação hidráulica — rede de esgoto Obra 1' },
      ]),

      ...buildHistory(P_TUBO50, uid, CAT_HIDRAUL, LOC_OBRA2, [
        { type: 'entry', qty: 30, date: '2025-06-01', obs: 'Compra inicial — 30 barras NF 002012' },
        { type: 'exit',  qty: 15, date: '2025-08-05', obs: 'Instalação esgoto — banheiros Obra 2' },
        { type: 'exit',  qty: 15, date: '2025-10-20', obs: 'Complemento rede de esgoto — estoque esgotado' },
      ]),

      ...buildHistory(P_JOELHO, uid, CAT_HIDRAUL, LOC_ARMAZEM, [
        { type: 'entry', qty: 40, date: '2025-06-01', obs: 'Compra inicial — 40 unidades NF 002013' },
        { type: 'exit',  qty: 18, date: '2025-07-15', obs: 'Uso em hidráulica — desvios e ramais Obra 1' },
      ]),

      ...buildHistory(P_REGISTRO, uid, CAT_HIDRAUL, LOC_ALMOX1, [
        { type: 'entry', qty: 10, date: '2025-06-01', obs: 'Compra inicial — 10 unidades NF 002014' },
        { type: 'exit',  qty: 10, date: '2025-07-30', obs: 'Instalação hidráulica — todos os registros instalados' },
      ]),

      ...buildHistory(P_CABO, uid, CAT_ELETRICO, LOC_OBRA1, [
        { type: 'entry', qty: 200, date: '2025-06-01', obs: 'Compra inicial — rolo 200m NF 002015, Prysmian' },
        { type: 'exit',  qty: 80,  date: '2025-07-10', obs: 'Instalação elétrica — pontos de tomada Obra 1' },
        { type: 'exit',  qty: 60,  date: '2025-09-15', obs: 'Ramais de iluminação e interruptores' },
      ]),

      ...buildHistory(P_DISJUNTOR, uid, CAT_ELETRICO, LOC_OBRA2, [
        { type: 'entry', qty: 30, date: '2025-06-01', obs: 'Compra inicial — 30 unidades NF 002016, WEG' },
        { type: 'exit',  qty: 12, date: '2025-08-10', obs: 'Instalação no QDC — quadro de distribuição Obra 2' },
      ]),

      ...buildHistory(P_TOMADA, uid, CAT_ELETRICO, LOC_ARMAZEM, [
        { type: 'entry', qty: 60, date: '2025-06-01', obs: 'Compra inicial — 60 unidades NF 002017' },
        { type: 'exit',  qty: 15, date: '2025-08-20', obs: 'Instalação pontos elétricos — Obra 1' },
      ]),

      ...buildHistory(P_INTERRUPTOR, uid, CAT_ELETRICO, LOC_ALMOX2, [
        { type: 'entry', qty: 20, date: '2025-06-01', obs: 'Compra inicial — 20 unidades NF 002018' },
        { type: 'exit',  qty: 8,  date: '2025-09-05', obs: 'Instalação pontos de luz — Obra 2' },
      ]),

      ...buildHistory(P_TINTA_BR, uid, CAT_TINTA, LOC_OBRA2, [
        { type: 'entry', qty: 15, date: '2025-10-01', obs: 'Compra para acabamento — NF 003001, Suvinil' },
        { type: 'exit',  qty: 7,  date: '2025-11-10', obs: 'Pintura interna — 1ª demão salas Obra 2' },
      ]),

      ...buildHistory(P_TINTA_EP, uid, CAT_TINTA, LOC_DEPOSITO, [
        { type: 'entry', qty: 10, date: '2025-10-01', obs: 'Compra para piso industrial — NF 003002, Sherwin-Williams' },
        { type: 'exit',  qty: 5,  date: '2025-11-20', obs: 'Pintura piso industrial — Obra 3 área de produção' },
        { type: 'exit',  qty: 3,  date: '2026-02-15', obs: '2ª demão do piso industrial — acabamento final' },
      ]),

      ...buildHistory(P_SELADOR, uid, CAT_TINTA, LOC_ARMAZEM, [
        { type: 'entry', qty: 8, date: '2025-10-01', obs: 'Compra inicial — NF 003003' },
        { type: 'exit',  qty: 3, date: '2025-11-15', obs: 'Selagem de paredes — pré-pintura Obra 2' },
      ]),

      ...buildHistory(P_MASSA_CORR, uid, CAT_TINTA, LOC_OBRA1, [
        { type: 'entry', qty: 20, date: '2025-10-01', obs: 'Compra para acabamento — NF 003004' },
        { type: 'exit',  qty: 14, date: '2025-12-10', obs: 'Massa corrida paredes internas — Obra 1' },
      ]),

      ...buildHistory(P_PREGO, uid, CAT_FIXACAO, LOC_OBRA3, [
        { type: 'entry', qty: 50, date: '2025-06-01', obs: 'Compra inicial — 50 caixas 1kg NF 002019' },
        { type: 'exit',  qty: 15, date: '2025-08-20', obs: 'Uso em formas de concreto — Obra 3' },
        { type: 'exit',  qty: 10, date: '2025-10-10', obs: 'Formas e estrutura auxiliar de madeiramento' },
      ]),

      ...buildHistory(P_PARAF_M8, uid, CAT_FIXACAO, LOC_ARMAZEM, [
        { type: 'entry', qty: 20, date: '2025-06-01', obs: 'Compra inicial — 20 caixas NF 002020' },
        { type: 'exit',  qty: 8,  date: '2025-09-20', obs: 'Fixações estruturais — Obra 3' },
      ]),

      ...buildHistory(P_BUCHA, uid, CAT_FIXACAO, LOC_ALMOX1, [
        { type: 'entry', qty: 25, date: '2025-06-01', obs: 'Compra inicial — 25 caixas de 100un NF 002021' },
        { type: 'exit',  qty: 10, date: '2025-08-05', obs: 'Fixações instalações hidráulicas — Obra 1' },
        { type: 'exit',  qty: 11, date: '2025-10-25', obs: 'Fixações Obra 2 — instalações elétricas' },
      ]),

      ...buildHistory(P_CHUMBADOR, uid, CAT_FIXACAO, LOC_OBRA2, [
        { type: 'entry', qty: 50, date: '2025-07-01', obs: 'Compra inicial — 50 unidades NF 002022' },
        { type: 'exit',  qty: 30, date: '2025-09-15', obs: 'Fixação estruturas metálicas — Obra 2' },
        { type: 'exit',  qty: 20, date: '2026-01-20', obs: 'Conclusão de fixações — esgotado, pedido pendente' },
      ]),

      ...buildHistory(P_MANTA, uid, CAT_IMPERM, LOC_OBRA3, [
        { type: 'entry', qty: 10, date: '2025-07-01', obs: 'Compra para impermeabilização — NF 002023' },
        { type: 'exit',  qty: 5,  date: '2025-08-15', obs: 'Impermeabilização laje de cobertura — Obra 3' },
        { type: 'exit',  qty: 3,  date: '2025-10-20', obs: 'Calha e terraço — impermeabilização complementar' },
      ]),

      ...buildHistory(P_IMPERM, uid, CAT_IMPERM, LOC_OBRA1, [
        { type: 'entry', qty: 10, date: '2025-07-01', obs: 'Compra inicial — 10 latas NF 002024' },
        { type: 'exit',  qty: 3,  date: '2025-08-20', obs: "Impermeabilização da caixa d'água — Obra 1" },
      ]),

      ...buildHistory(P_COMPENSADO, uid, CAT_MADEIRA, LOC_ALMOX2, [
        { type: 'entry', qty: 30, date: '2025-06-15', obs: 'Compra inicial — 30 chapas NF 002025' },
        { type: 'exit',  qty: 15, date: '2025-08-10', obs: 'Fôrmas de concreto — Obra 3 pilares e vigas' },
      ]),

      ...buildHistory(P_LONA, uid, CAT_MADEIRA, LOC_OBRA3, [
        { type: 'entry', qty: 200, date: '2025-06-15', obs: 'Compra inicial — 200m² NF 002026' },
        { type: 'exit',  qty: 50,  date: '2025-07-25', obs: 'Proteção de materiais — Obra 3 período chuvoso' },
        { type: 'exit',  qty: 30,  date: '2025-09-10', obs: 'Cobertura provisória — Obra 1 andaimes e materiais' },
      ]),

      ...buildHistory(P_CAPACETE, uid, CAT_EPI, LOC_OBRA1, [
        { type: 'entry', qty: 25, date: '2025-06-01', obs: 'Compra inicial EPI — NF 002027, fornecedor 3M' },
        { type: 'exit',  qty: 10, date: '2025-07-15', obs: 'Distribuição para equipe — Obra 2' },
      ]),

      ...buildHistory(P_LUVA, uid, CAT_EPI, LOC_OBRA2, [
        { type: 'entry', qty: 20, date: '2025-06-01', obs: 'Compra inicial EPI — NF 002028' },
        { type: 'exit',  qty: 10, date: '2025-07-10', obs: 'Distribuição para equipes Obra 1 e Obra 2' },
        { type: 'exit',  qty: 6,  date: '2025-10-20', obs: 'Reposição luvas danificadas pelo uso em obra' },
      ]),

      ...buildHistory(P_OCULOS, uid, CAT_EPI, LOC_ARMAZEM, [
        { type: 'entry', qty: 30, date: '2025-06-01', obs: 'Compra inicial EPI — NF 002029, fornecedor 3M' },
        { type: 'exit',  qty: 8,  date: '2025-08-15', obs: 'Distribuição para equipe — Obra 3 galpão industrial' },
      ]),

      ...buildHistory(P_CINTO, uid, CAT_EPI, LOC_DEPOSITO, [
        { type: 'entry', qty: 5, date: '2025-06-01', obs: 'Compra inicial EPI — NF 002030, fornecedor DeltaPlus' },
        { type: 'exit',  qty: 1, date: '2025-08-25', obs: 'Distribuição — Obra 3 trabalho em altura > 2m' },
        { type: 'exit',  qty: 2, date: '2026-01-10', obs: 'Distribuição — Obra 4 trabalho em telhado escola' },
      ]),

      ...buildHistory(P_BOTA, uid, CAT_EPI, LOC_ALMOX2, [
        { type: 'entry', qty: 20, date: '2025-06-01', obs: 'Compra inicial EPI — NF 002031, 20 pares sortidos' },
        { type: 'exit',  qty: 10, date: '2025-07-20', obs: 'Distribuição para equipe — campo encharcado Obra 3' },
        { type: 'exit',  qty: 10, date: '2025-09-15', obs: 'Distribuição final — estoque esgotado, pedido pendente' },
      ]),
    ];

    for (const sql of allHistory) {
      await qr.query(sql);
    }
    console.log(`✅ Histórico inserido (${allHistory.length} movimentações)`);

    await qr.commitTransaction();

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🎉  SEED CONCLUÍDO COM SUCESSO!');
    console.log('───────────────────────────────────────────────────────────────');
    console.log(`  👤  Login:         mvfrt9805@gmail.com`);
    console.log(`  🔑  Senha:         Stock@2025`);
    console.log(`  📦  Produtos:      60  (25 ferramentas + 35 materiais)`);
    console.log(`  📍  Localizações:  8   (4 obras + 4 depósitos/armazéns)`);
    console.log(`  🏷️  Categorias:    12`);
    console.log(`  📋  Movimentações: ${allHistory.length}`);
    console.log(`  📅  Período:       01/06/2025 → 02/05/2026`);
    console.log(`  🔴  Vazios:        9 produtos (qty = 0)`);
    console.log(`  🟡  Baixo estoque: 13 produtos (qty < mínimo)`);
    console.log(`  🟢  OK:            38 produtos`);
    console.log('═══════════════════════════════════════════════════════════════');

  } catch (error) {
    await qr.rollbackTransaction();
    console.error('❌ Erro no seed — transação revertida:', error);
    throw error;
  } finally {
    await qr.release();
    await ds.destroy();
  }
}

seed().catch(console.error);
