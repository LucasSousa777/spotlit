// Gera as páginas de serviço da Spotlit (servicos/<slug>/index.html), o hub /servicos/, sitemap.xml e robots.txt.
// Uso: node gerar-servicos.mjs   (depois: git add + commit + push)
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://lucassousa777.github.io/spotlit/';
const WA = 'https://wa.me/5581992071058?text=' + encodeURIComponent('Olá! Quero o diagnóstico grátis do meu negócio.');
const HOJE = new Date().toISOString().slice(0, 10);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const S = [
 {
  slug: 'diagnostico-gratuito',
  nome: 'Diagnóstico gratuito no Google',
  title: 'Diagnóstico gratuito no Google Maps | Spotlit',
  desc: 'Descubra em que posição o seu negócio aparece no Google Maps para quem pesquisa perto de você, com print real e a lista de quem aparece na frente. Grátis.',
  h1: ['Diagnóstico', 'grátis no Google.'],
  resumo: 'O diagnóstico gratuito da Spotlit mostra em que posição o seu negócio aparece no Google Maps quando alguém pesquisa o seu serviço perto de você. A gente pesquisa a partir do seu endereço e de 4 pontos ao redor, e te manda o print real com quem aparece na frente e por quê.',
  inclui: ['Pesquisa no Google Maps a partir de 5 pontos ao redor do seu negócio', 'Print real da busca, com data, e o seu negócio destacado', 'Comparação de nota, número de avaliações e site com os 3 primeiros', 'O que fazer primeiro para subir, em linguagem simples'],
  passos: ['Você manda o nome do seu negócio e a cidade pelo WhatsApp.', 'A gente pesquisa como o cliente pesquisa: o seu serviço + a sua cidade.', 'Você recebe o print e uma conversa de 10 minutos para entender o resultado.'],
  quem: 'Clínicas, consultórios, escritórios, academias, estúdios, pet shops e qualquer negócio local que depende de cliente da região.',
  faq: [
   ['O diagnóstico é grátis mesmo?', 'Sim. Você não paga nada e não assume compromisso. Se fizer sentido, a gente apresenta um plano depois.'],
   ['Por que a minha posição muda quando eu pesquiso do meu celular?', 'O Google Maps ordena os resultados pela distância de quem pesquisa, pela relevância e pela reputação do negócio. Por isso a Spotlit pesquisa a partir de 5 pontos e mostra todos os resultados, não só um.'],
   ['Quanto tempo leva?', 'Normalmente você recebe o print no mesmo dia em que manda o nome do negócio.'],
   ['Vocês atendem a minha cidade?', 'Sim. O diagnóstico e todo o trabalho são feitos online, para negócios de todo o Brasil.'],
  ],
 },
 {
  slug: 'perfil-da-empresa-no-google',
  nome: 'Otimização do Perfil da Empresa no Google',
  title: 'Otimização do Perfil da Empresa no Google (Google Meu Negócio) | Spotlit',
  desc: 'Perfil da Empresa no Google completo: categorias, serviços, fotos, descrição, WhatsApp, posts e rotina de avaliações para o seu negócio aparecer no Google Maps.',
  h1: ['Perfil da Empresa', 'no Google.'],
  resumo: 'A Spotlit deixa o seu Perfil da Empresa no Google (antigo Google Meu Negócio) completo e ativo: categorias certas, todos os serviços, fotos reais, descrição, botão de WhatsApp, posts e uma rotina simples para pedir avaliações. É o que o Google e a IA do Google usam para decidir quem indicar no Maps.',
  inclui: ['Categoria principal e categorias adicionais certas para o seu serviço', 'Cadastro de todos os serviços, com descrição', 'Descrição, horário, área de atendimento e botão de WhatsApp', 'Fotos organizadas (logo, capa, equipe, ambiente e trabalho)', 'Respostas às avaliações, sem expor dados de clientes', 'Kit para pedir avaliação: mensagem pronta + QR code', 'Posts semanais nos planos mensais'],
  passos: ['Diagnóstico da posição atual no Maps.', 'Ajuste completo do perfil (você só aprova).', 'Rotina de avaliações e posts; medição do antes e depois.'],
  quem: 'Negócios que já têm perfil no Google mas aparecem abaixo dos concorrentes, ou que ainda não têm perfil verificado.',
  faq: [
   ['O que é o Perfil da Empresa no Google?', 'É a ficha do seu negócio que aparece no Google Maps e na Pesquisa, com nota, avaliações, fotos, horário e botão para ligar ou chamar no WhatsApp. Antes se chamava Google Meu Negócio.'],
   ['Por que o meu concorrente aparece na frente se a minha nota é melhor?', 'Porque o Google não olha só a nota. Ele pesa a relevância do perfil (categorias e serviços), a distância de quem pesquisa e a reputação, que inclui quantidade e frequência de avaliações.'],
   ['Vocês compram avaliações?', 'Não. Avaliação falsa é contra as regras do Google e pode derrubar o perfil. A gente cria uma rotina para pedir avaliação aos seus clientes reais.'],
   ['Em quanto tempo o perfil sobe?', 'O perfil completo muda a impressão de quem te encontra no mesmo dia. A posição no Maps costuma mudar entre 30 e 90 dias, conforme as avaliações chegam.'],
   ['Preciso ter endereço aberto ao público?', 'Não. Quem atende na casa do cliente ou online com visitas pode ter um perfil de área de atendimento, com o endereço oculto.'],
  ],
 },
 {
  slug: 'criacao-de-sites',
  nome: 'Criação de site com animação',
  title: 'Criação de site com animação para negócios locais | Spotlit',
  desc: 'Sites rápidos no celular, com motion design e caminho direto para o WhatsApp. Página única ou site completo com uma página por serviço, preparado para o Google.',
  h1: ['Sites que levam', 'ao WhatsApp.'],
  resumo: 'A Spotlit cria sites rápidos no celular, com animação (motion design) e um caminho direto para o seu WhatsApp. Pode ser uma página única ou um site completo, com uma página para cada serviço, preparado para o Google e para a IA do Google entenderem o que você faz e onde atende.',
  inclui: ['Design sob medida, sem modelo pronto', 'Animações leves que não deixam o site lento', 'Botão de WhatsApp em todas as telas', 'Uma página por serviço (no site completo)', 'Perguntas frequentes escritas do jeito que o cliente pergunta', 'Dados estruturados (schema), Search Console e sitemap'],
  passos: ['Conversa sobre o seu negócio e os serviços que mais vendem.', 'Primeira versão no ar para você aprovar.', 'Ajustes, publicação e cadastro no Google.'],
  quem: 'Negócios sem site, com site antigo ou com "site" que é só o link do Instagram.',
  faq: [
   ['Preciso de site se já tenho Instagram?', 'O Instagram é ótimo para mostrar o dia a dia, mas o Google e a IA quase não leem o que está lá. O site é a página que confirma o que você faz, onde atende e como chamar.'],
   ['O site fica pronto em quanto tempo?', 'O prazo é combinado no orçamento, conforme o tamanho do site. A página única é a mais rápida de colocar no ar.'],
   ['Animação não deixa o site lento?', 'Não, se for bem feita. A Spotlit usa animações leves e testa a velocidade no celular antes de publicar.'],
   ['Eu consigo mudar o texto depois?', 'Sim. Pequenas mudanças entram no acompanhamento mensal, ou você pede quando precisar.'],
  ],
 },
 {
  slug: 'edicao-de-reels',
  nome: 'Edição de reels e vídeos',
  title: 'Edição de reels e vídeos para Instagram e anúncios | Spotlit',
  desc: 'Você grava com o celular seguindo o nosso roteiro e a Spotlit edita: legenda, motion, música e gancho. Reels para Instagram e vídeos para anúncios.',
  h1: ['Reels com', 'gancho e motion.'],
  resumo: 'Na Spotlit, você grava com o próprio celular seguindo um roteiro pronto, e a gente edita: gancho nos primeiros segundos, legenda, motion design e música. São reels para o Instagram e vídeos curtos para os anúncios, feitos para o cliente confiar em você antes de chamar.',
  inclui: ['Roteiro com gancho para cada vídeo', 'Edição com legenda animada, cortes e música', 'Motion design e textos na tela', 'Versões para reels, stories e anúncios', 'Capa para o feed'],
  passos: ['A gente manda o roteiro do mês.', 'Você grava no celular (leva poucos minutos por vídeo).', 'A gente edita e te entrega pronto para postar.'],
  quem: 'Profissionais e negócios que precisam aparecer em vídeo mas não têm tempo de editar.',
  faq: [
   ['Preciso ter câmera profissional?', 'Não. O celular que você já tem é suficiente. O roteiro inclui dicas de luz e enquadramento.'],
   ['Quantos vídeos por mês?', 'O plano Presença inclui 4 reels por mês e o plano Posicionamento completo inclui 8.'],
   ['Vocês postam por mim?', 'A entrega é o vídeo pronto, com legenda sugerida. A postagem pode ser combinada no plano.'],
   ['Vídeo ajuda no Google?', 'Indiretamente, sim: o cliente que te encontra no Google costuma abrir o Instagram antes de chamar, e é ali que ele decide se confia em você.'],
  ],
 },
 {
  slug: 'gestao-de-anuncios',
  nome: 'Gestão de anúncios Meta e Google',
  title: 'Gestão de anúncios no Instagram, Facebook e Google | Spotlit',
  desc: 'Campanhas no Instagram, Facebook e Google para levar gente da sua região ao seu WhatsApp, com criativos feitos pela Spotlit e o resto da presença pronto.',
  h1: ['Anúncios que', 'chegam no WhatsApp.'],
  resumo: 'A Spotlit cria e gerencia anúncios no Instagram, no Facebook e no Google para levar pessoas da sua região até o seu WhatsApp. Antes de anunciar, a gente arruma o que o cliente confere depois do anúncio (Google, site e vídeos), para o dinheiro não vazar para o concorrente.',
  inclui: ['Planejamento de campanha por objetivo (mensagens, ligações, visitas)', 'Criativos em vídeo e imagem feitos pela Spotlit', 'Segmentação por região e público', 'Acompanhamento semanal e relatório mensal', 'Gestão de até R$ 3 mil de verba por mês (a verba é paga direto à plataforma)'],
  passos: ['Diagnóstico do que o cliente vê depois do anúncio.', 'Criação das campanhas e dos criativos.', 'Ajustes semanais e relatório com custo por conversa.'],
  quem: 'Negócios que já anunciam e não sabem se está funcionando, ou que querem começar com o resto da presença pronto.',
  faq: [
   ['Já anuncio e recebo mensagens. Por que mudar?', 'Muita gente vê o anúncio, pesquisa o seu nome no Google antes de chamar e acaba chamando outro. A gestão da Spotlit cuida do anúncio e desse caminho depois dele.'],
   ['Quanto preciso investir em anúncio?', 'Depende da cidade e do serviço. Muitos negócios locais começam com R$ 20 a R$ 50 por dia. A verba é paga direto ao Meta ou ao Google.'],
   ['Vocês garantem número de clientes?', 'Não. Ninguém sério garante. O que a gente mostra é o custo por conversa e o que está sendo feito para baixar esse custo.'],
  ],
 },
 {
  slug: 'ia-do-google-e-chatgpt',
  nome: 'Presença na IA do Google e no ChatGPT',
  title: 'Como aparecer na IA do Google e no ChatGPT | Spotlit',
  desc: 'Organizamos o seu Perfil no Google, site, avaliações e cadastros para a IA do Google e o ChatGPT entenderem e citarem o seu negócio. Com medição do antes e depois.',
  h1: ['Ser citado pela', 'IA do Google.'],
  resumo: 'Para a IA do Google e o ChatGPT indicarem o seu negócio, eles precisam encontrar informação clara e confiável sobre você em vários lugares: Perfil da Empresa no Google, site com páginas que respondem às perguntas do cliente, avaliações reais, cadastro no Bing e menções em outros sites. A Spotlit organiza tudo isso e mede, pergunta por pergunta, se a IA passou a te citar.',
  inclui: ['Levantamento das perguntas que os seus clientes fazem à IA', 'Medição inicial: quem a IA cita hoje no seu lugar', 'Páginas e perguntas frequentes no site, escritas para serem citadas', 'Dados estruturados (schema) e liberação dos robôs das IAs', 'Cadastro e correção no Google, Bing e diretórios do seu setor', 'Nova medição com as mesmas perguntas: o antes e depois'],
  passos: ['Medição inicial com as perguntas reais dos seus clientes.', 'Correções no perfil, no site e nos cadastros.', 'Nova medição em 30 a 60 dias, com as mesmas perguntas.'],
  quem: 'Negócios que querem aparecer quando o cliente pergunta "qual o melhor [serviço] em [cidade]?" para a IA.',
  faq: [
   ['Dá para garantir que a IA vai indicar o meu negócio?', 'Não. Ninguém controla o que a IA responde. O que dá para fazer é dar a ela informação clara, consistente e confirmada por outras fontes, e medir se as citações aumentam.'],
   ['De onde o ChatGPT tira as indicações?', 'Quando pesquisa na web, o ChatGPT usa resultados de busca, em boa parte do Bing, e cita sites, diretórios, avaliações e notícias. Por isso o cadastro no Bing e a presença em outros sites importam.'],
   ['E a IA do Google?', 'A Visão geral criada por IA e o Modo IA usam o índice do Google, o Perfil da Empresa, as avaliações e os sites que respondem bem à pergunta.'],
   ['Como vocês medem?', 'A gente faz as mesmas perguntas antes e depois do trabalho e registra quem foi citado em cada uma. No primeiro caso da Spotlit, o ponto de partida era 0 de 14 perguntas citando o escritório.'],
  ],
 },
];

const cabeca = (t, d, url, ld) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(d)}">
<meta name="theme-color" content="#0B0C10">
<link rel="canonical" href="${url}">
<link rel="icon" href="${BASE}img/favicon-32.png" sizes="32x32">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(d)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}img/og.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}css/servico.css">
${ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>
<body>
<header class="sv-nav"><a href="${BASE}" aria-label="Spotlit, início"><img src="${BASE}img/logo.png" alt="Spotlit" width="132" height="22"></a>
<nav aria-label="Serviços"><a href="${BASE}servicos/">Serviços</a><a href="${BASE}#caso">Caso real</a></nav>
<a class="btn btn--small" href="${WA}" target="_blank" rel="noopener">Diagnóstico grátis</a></header>
<main id="conteudo">`;

const rodape = `</main>
<footer class="sv-foot"><div class="wrap"><img src="${BASE}img/logo.png" alt="Spotlit" width="110" height="18" loading="lazy">
<p>Spotlit · marketing e posicionamento para negócios locais · Caruaru-PE · atendemos todo o Brasil · (81) 99207-1058</p>
<p><a href="${BASE}servicos/">Todos os serviços</a> · <a href="https://www.instagram.com/spotlitstudio_/" target="_blank" rel="noopener">Instagram</a> · <a href="${WA}" target="_blank" rel="noopener">WhatsApp</a></p></div></footer>
<a class="fab" href="${WA}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">WhatsApp</a>
</body></html>`;

const ORG = { '@type': 'ProfessionalService', '@id': BASE + '#org', name: 'Spotlit', url: BASE, telephone: '+55-81-99207-1058',
  address: { '@type': 'PostalAddress', addressLocality: 'Caruaru', addressRegion: 'PE', addressCountry: 'BR' }, areaServed: 'BR',
  sameAs: ['https://www.instagram.com/spotlitstudio_/'] };

for (const s of S) {
  const url = `${BASE}servicos/${s.slug}/`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Service', name: s.nome, description: s.resumo, serviceType: s.nome, areaServed: { '@type': 'Country', name: 'Brasil' }, provider: ORG, url },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: s.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Spotlit', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Serviços', item: BASE + 'servicos/' },
      { '@type': 'ListItem', position: 3, name: s.nome, item: url }] },
  ];
  const outros = S.filter(o => o.slug !== s.slug).map(o => `<li><a href="${BASE}servicos/${o.slug}/">${esc(o.nome)} →</a></li>`).join('');
  const html = cabeca(s.title, s.desc, url, ld) + `
<section class="sv-hero"><div class="wrap">
<nav class="crumbs" aria-label="Você está em"><a href="${BASE}">Spotlit</a> / <a href="${BASE}servicos/">Serviços</a> / <span>${esc(s.nome)}</span></nav>
<h1>${esc(s.h1[0])} <em>${esc(s.h1[1])}</em></h1>
<p class="sv-lead">${esc(s.resumo)}</p>
<a class="btn" href="${WA}" target="_blank" rel="noopener">Pedir diagnóstico grátis <span aria-hidden="true">→</span></a>
</div></section>
<section class="sv-block"><div class="wrap sv-grid">
<div><h2>O que <em>está incluído</em></h2><ul class="sv-list">${s.inclui.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
<div><h2>Como <em>funciona</em></h2><ol class="sv-steps">${s.passos.map(p => `<li>${esc(p)}</li>`).join('')}</ol>
<p class="sv-who"><b>Para quem é:</b> ${esc(s.quem)}</p></div>
</div></section>
<section class="sv-block sv-case"><div class="wrap">
<p class="eyebrow">Caso real</p>
<h2>Arruda &amp; Vieira <em>Advocacia</em></h2>
<p>Escritório em Caruaru-PE. Criamos o site com uma página por área de atuação, reorganizamos o Perfil da Empresa no Google (22 serviços cadastrados) e medimos quantas perguntas de clientes ao Google citavam o escritório: <b>0 de 14</b> antes do trabalho. A nova medição, com as mesmas perguntas, sai em dezembro de 2026.</p>
</div></section>
<section class="sv-block"><div class="wrap sv-faq">
<h2>Perguntas <em>frequentes</em></h2>
${s.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
</div></section>
<section class="sv-block"><div class="wrap"><h2>Outros <em>serviços</em></h2><ul class="sv-more">${outros}</ul></div></section>
<section class="sv-cta"><div class="wrap"><h2>Quer saber onde o seu negócio aparece hoje?</h2>
<p>O diagnóstico é grátis. Mande o nome do seu negócio e a cidade no WhatsApp.</p>
<a class="btn btn--dark" href="${WA}" target="_blank" rel="noopener">Chamar no WhatsApp <span aria-hidden="true">→</span></a></div></section>
` + rodape;
  mkdirSync(join(here, 'servicos', s.slug), { recursive: true });
  writeFileSync(join(here, 'servicos', s.slug, 'index.html'), html);
}

// hub
const hubUrl = BASE + 'servicos/';
const hub = cabeca('Serviços da Spotlit: Google, IA, sites, vídeos e anúncios', 'Todos os serviços da Spotlit para negócios locais: diagnóstico grátis, Perfil da Empresa no Google, sites com animação, reels, anúncios e presença na IA do Google e no ChatGPT.', hubUrl,
  [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: S.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.nome, url: `${BASE}servicos/${s.slug}/` })) }]) + `
<section class="sv-hero"><div class="wrap">
<nav class="crumbs" aria-label="Você está em"><a href="${BASE}">Spotlit</a> / <span>Serviços</span></nav>
<h1>Serviços da <em>Spotlit.</em></h1>
<p class="sv-lead">A Spotlit cuida de tudo que o cliente vê antes de chamar o seu negócio: o Google e a IA, o perfil no Maps, o site, os vídeos e os anúncios. Você não precisa contratar tudo. Comece pelo diagnóstico grátis.</p>
</div></section>
<section class="sv-block"><div class="wrap"><ul class="sv-cards">
${S.map(s => `<li><a href="${BASE}servicos/${s.slug}/"><h2>${esc(s.nome)}</h2><p>${esc(s.desc)}</p><span>Ver o serviço →</span></a></li>`).join('\n')}
</ul></div></section>
` + rodape;
writeFileSync(join(here, 'servicos', 'index.html'), hub);

// sitemap + robots
const urls = [BASE, hubUrl, ...S.map(s => `${BASE}servicos/${s.slug}/`)];
writeFileSync(join(here, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc><lastmod>${HOJE}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(here, 'robots.txt'), `# Liberado para buscadores e robôs de IA (Google, Bing, ChatGPT, Perplexity, Claude)\nUser-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
console.log('ok:', urls.length, 'urls');
