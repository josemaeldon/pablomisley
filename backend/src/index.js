require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const { Pool } = require('pg');

const JWT_SECRET = process.env.JWT_SECRET || 'pablomisley_jwt_secret_change_in_production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('Apenas imagens são permitidas'), ok);
  },
});

const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS hero (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) DEFAULT 'Tudo para a glória de Deus.',
    subtitulo VARCHAR(500) DEFAULT '"Para mim, o viver é Cristo" (Filipenses 1,21)',
    descricao TEXT DEFAULT 'Padre Pablo Misley, sacerdote católico, dedica sua vida à evangelização através da música, da Palavra e do serviço.',
    btn1_texto VARCHAR(100) DEFAULT 'CONHEÇA MINHA HISTÓRIA',
    btn2_texto VARCHAR(100) DEFAULT 'ACOMPANHE OS CONTEÚDOS',
    imagem_url VARCHAR(500) DEFAULT '',
    updated_at TIMESTAMP DEFAULT NOW()
  );
  INSERT INTO hero (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

  CREATE TABLE IF NOT EXISTS pilares (
    id SERIAL PRIMARY KEY,
    icone VARCHAR(100) DEFAULT 'cross',
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    ordem INTEGER DEFAULT 0
  );
  INSERT INTO pilares (titulo, descricao, icone, ordem)
  SELECT 'Eucaristia','Fonte e centro da minha vida e missão.','chalice',1
  WHERE NOT EXISTS (SELECT 1 FROM pilares);
  INSERT INTO pilares (titulo, descricao, icone, ordem)
  SELECT 'Palavra','Anunciar o Evangelho com fidelidade e amor.','book',2
  WHERE NOT EXISTS (SELECT 1 FROM pilares WHERE ordem=2);
  INSERT INTO pilares (titulo, descricao, icone, ordem)
  SELECT 'Comunhão','Caminhar com o povo de Deus em unidade.','people',3
  WHERE NOT EXISTS (SELECT 1 FROM pilares WHERE ordem=3);
  INSERT INTO pilares (titulo, descricao, icone, ordem)
  SELECT 'Caridade','Servir a todos com misericórdia e esperança.','heart',4
  WHERE NOT EXISTS (SELECT 1 FROM pilares WHERE ordem=4);

  CREATE TABLE IF NOT EXISTS conteudos (
    id SERIAL PRIMARY KEY,
    imagem_url VARCHAR(500) DEFAULT '',
    categoria VARCHAR(100) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50) DEFAULT 'video',
    ordem INTEGER DEFAULT 0
  );
  INSERT INTO conteudos (categoria, titulo, descricao, tipo, ordem)
  SELECT 'HOMILIAS','Homilias','Homilias que tocam o coração e iluminam o caminho.','video',1
  WHERE NOT EXISTS (SELECT 1 FROM conteudos WHERE ordem=1);
  INSERT INTO conteudos (categoria, titulo, descricao, tipo, ordem)
  SELECT 'REFLEXÕES','Reflexões','Reflexões diárias para fortalecer sua caminhada.','article',2
  WHERE NOT EXISTS (SELECT 1 FROM conteudos WHERE ordem=2);
  INSERT INTO conteudos (categoria, titulo, descricao, tipo, ordem)
  SELECT 'VÍDEOS','Vídeos','Assista e compartilhe mensagens de fé e esperança.','video',3
  WHERE NOT EXISTS (SELECT 1 FROM conteudos WHERE ordem=3);
  INSERT INTO conteudos (categoria, titulo, descricao, tipo, ordem)
  SELECT 'FORMAÇÃO','Formação','Formação católica para viver sua fé com profundidade.','course',4
  WHERE NOT EXISTS (SELECT 1 FROM conteudos WHERE ordem=4);

  CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    imagem_url VARCHAR(500) DEFAULT '',
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    ordem INTEGER DEFAULT 0
  );
  INSERT INTO produtos (nome, preco, ordem)
  SELECT 'Imitação de Cristo',49.90,1 WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE ordem=1);
  INSERT INTO produtos (nome, preco, ordem)
  SELECT 'Terço de São Bento',34.90,2 WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE ordem=2);
  INSERT INTO produtos (nome, preco, ordem)
  SELECT 'Imagem de Nossa Senhora Aparecida',89.90,3 WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE ordem=3);
  INSERT INTO produtos (nome, preco, ordem)
  SELECT 'Caneca Deus é meu refúgio',39.90,4 WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE ordem=4);

  CREATE TABLE IF NOT EXISTS configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT
  );
  INSERT INTO configuracoes (chave, valor) VALUES
    ('newsletter_texto','Receba novidades e conteúdos exclusivos no seu e-mail!'),
    ('citacao_texto','Tudo posso naquele que me fortalece.'),
    ('citacao_referencia','FILIPENSES 4,13'),
    ('footer_descricao','Sacerdote católico, missionário, servo da Palavra e do Altar.'),
    ('loja_titulo','Artigos que ajudam você a viver sua fé todos os dias.'),
    ('newsletter_imagem',''),
    ('citacao_imagem','')
  ON CONFLICT (chave) DO NOTHING;
`;

async function connectWithRetry(retries = 10, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      console.log('Connected to PostgreSQL');
      await client.query(CREATE_TABLES_SQL);
      console.log('Database initialized');
      client.release();
      return;
    } catch (err) {
      console.error(`Database connection attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error('Could not connect to the database after ' + retries + ' attempts.');
      }
    }
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

const setupLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many setup requests.' });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many login attempts.' });

// ===================== PUBLIC ROUTES =====================

app.get('/', (req, res) => res.send('Backend is running!'));

app.get('/api/hero', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hero WHERE id = 1');
    res.json(result.rows[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/pilares', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pilares ORDER BY ordem');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/conteudos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conteudos ORDER BY ordem');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/produtos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY ordem');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/configuracoes', async (req, res) => {
  try {
    const result = await pool.query('SELECT chave, valor FROM configuracoes');
    const config = {};
    result.rows.forEach(r => { config[r.chave] = r.valor; });
    res.json(config);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===================== ADMIN ROUTES =====================

app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

app.get('/api/admin/verify', authMiddleware, (req, res) => res.json({ ok: true }));

app.post('/api/admin/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Hero
app.get('/api/admin/hero', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hero WHERE id = 1');
    res.json(result.rows[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/hero', authMiddleware, async (req, res) => {
  const { titulo, subtitulo, descricao, btn1_texto, btn2_texto, imagem_url } = req.body;
  try {
    await pool.query(
      'UPDATE hero SET titulo=$1,subtitulo=$2,descricao=$3,btn1_texto=$4,btn2_texto=$5,imagem_url=$6,updated_at=NOW() WHERE id=1',
      [titulo, subtitulo, descricao, btn1_texto, btn2_texto, imagem_url]
    );
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Pilares
app.get('/api/admin/pilares', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pilares ORDER BY ordem');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/pilares', authMiddleware, async (req, res) => {
  const { icone, titulo, descricao, ordem } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pilares (icone,titulo,descricao,ordem) VALUES ($1,$2,$3,$4) RETURNING *',
      [icone, titulo, descricao, ordem || 0]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/pilares/:id', authMiddleware, async (req, res) => {
  const { icone, titulo, descricao, ordem } = req.body;
  try {
    await pool.query('UPDATE pilares SET icone=$1,titulo=$2,descricao=$3,ordem=$4 WHERE id=$5',
      [icone, titulo, descricao, ordem, req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/pilares/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM pilares WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Conteúdos
app.get('/api/admin/conteudos', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conteudos ORDER BY ordem');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/conteudos', authMiddleware, async (req, res) => {
  const { imagem_url, categoria, titulo, descricao, tipo, ordem } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO conteudos (imagem_url,categoria,titulo,descricao,tipo,ordem) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [imagem_url || '', categoria, titulo, descricao, tipo || 'video', ordem || 0]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/conteudos/:id', authMiddleware, async (req, res) => {
  const { imagem_url, categoria, titulo, descricao, tipo, ordem } = req.body;
  try {
    await pool.query(
      'UPDATE conteudos SET imagem_url=$1,categoria=$2,titulo=$3,descricao=$4,tipo=$5,ordem=$6 WHERE id=$7',
      [imagem_url, categoria, titulo, descricao, tipo, ordem, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/conteudos/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM conteudos WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Produtos
app.get('/api/admin/produtos', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY ordem');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/produtos', authMiddleware, async (req, res) => {
  const { imagem_url, nome, preco, ordem } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO produtos (imagem_url,nome,preco,ordem) VALUES ($1,$2,$3,$4) RETURNING *',
      [imagem_url || '', nome, preco, ordem || 0]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/produtos/:id', authMiddleware, async (req, res) => {
  const { imagem_url, nome, preco, ordem } = req.body;
  try {
    await pool.query('UPDATE produtos SET imagem_url=$1,nome=$2,preco=$3,ordem=$4 WHERE id=$5',
      [imagem_url, nome, preco, ordem, req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/produtos/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM produtos WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Configurações
app.get('/api/admin/configuracoes', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT chave, valor FROM configuracoes');
    const config = {};
    result.rows.forEach(r => { config[r.chave] = r.valor; });
    res.json(config);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/configuracoes', authMiddleware, async (req, res) => {
  try {
    for (const [chave, valor] of Object.entries(req.body)) {
      await pool.query(
        'INSERT INTO configuracoes (chave,valor) VALUES ($1,$2) ON CONFLICT (chave) DO UPDATE SET valor=$2',
        [chave, valor]
      );
    }
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Legacy setup route
app.post('/api/setup', setupLimiter, async (req, res) => {
  const { host, user, password, database } = req.body;
  const connectionString = `postgres://${user}:${password}@${host}:5432/${database}`;
  let newPool;
  try {
    newPool = new Pool({ connectionString });
    const client = await newPool.connect();
    await client.query(CREATE_TABLES_SQL);
    client.release();
    fs.writeFileSync('.env', `DATABASE_URL=${connectionString}\n`);
    process.env.DATABASE_URL = connectionString;
    const oldPool = pool;
    pool = newPool;
    await oldPool.end();
    res.status(200).send('Database configured successfully!');
  } catch (err) {
    console.error('Database connection error:', err);
    if (newPool) await newPool.end().catch(() => {});
    res.status(500).send('Failed to connect to the database.');
  }
});

// Start server
connectWithRetry()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });