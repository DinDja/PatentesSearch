const BAHIA_TERRITORY_MUNICIPALITIES = {
  'Irece': [
    'America Dourada', 'Barra do Mendes', 'Barro Alto', 'Cafarnaum', 'Canarana', 'Central',
    'Gentio do Ouro', 'Ibipeba', 'Ibitita', 'Ipupiara', 'Irece', 'Itaguacu da Bahia',
    'Joao Dourado', 'Jussara', 'Lapao', 'Mulungu do Morro', 'Presidente Dutra', 'Uibai',
    'Sao Gabriel', 'Xique-Xique'
  ],
  'Velho Chico': [
    'Barra', 'Bom Jesus da Lapa', 'Brotas de Macaubas', 'Carinhanha', 'Feira da Mata',
    'Ibotirama', 'Igapora', 'Malhada', 'Matina', 'Morpara', 'Muquem do Sao Francisco',
    'Oliveira dos Brejinhos', 'Paratinga', 'Riacho de Santana', 'Serra do Ramalho', 'Sitio do Mato'
  ],
  'Chapada Diamantina': [
    'Abaira', 'Andarai', 'Barra da Estiva', 'Boninal', 'Bonito', 'Ibicoara', 'Ibitiara',
    'Iramaia', 'Iraquara', 'Itaete', 'Jussiape', 'Lencois', 'Marcionilio Souza',
    'Morro do Chapeu', 'Mucuge', 'Nova Redencao', 'Novo Horizonte', 'Palmeiras', 'Piata',
    'Rio de Contas', 'Seabra', 'Souto Soares', 'Utinga', 'Wagner'
  ],
  'Sisal': [
    'Araci', 'Barrocas', 'Biritinga', 'Candeal', 'Cansancao', 'Conceicao do Coite', 'Ichu',
    'Itiuba', 'Lamarao', 'Monte Santo', 'Nordestina', 'Queimadas', 'Quijingue',
    'Retirolandia', 'Santaluz', 'Sao Domingos', 'Serrinha', 'Teofilandia', 'Tucano', 'Valente'
  ],
  'Litoral Sul': [
    'Almadina', 'Arataca', 'Aurelino Leal', 'Barro Preto', 'Buerarema', 'Camacan',
    'Canavieiras', 'Coaraci', 'Floresta Azul', 'Ibicarai', 'Ilheus', 'Itabuna', 'Itacare',
    'Itaju do Colonia', 'Itajuipe', 'Itape', 'Itapitanga', 'Jussari', 'Marau', 'Mascote',
    'Pau-Brasil', 'Santa Luzia', 'Sao Jose da Vitoria', 'Ubaitaba', 'Uma', 'Urucuca'
  ],
  'Baixo Sul': [
    'Aratuipe', 'Cairu', 'Camamu', 'Gandu', 'Ibirapitanga', 'Igrapiuna', 'Itubera',
    'Jaguaripe', 'Nilo Pecanha', 'Pirai do Norte', 'Presidente Tancredo Neves', 'Taperoa',
    'Teolandia', 'Valenca', 'Wenceslau Guimaraes'
  ],
  'Extremo Sul': [
    'Alcobaca', 'Caravelas', 'Ibirapoa', 'Itamaraju', 'Itanhem', 'Jucurucu', 'Lajedao',
    'Medeiros Neto', 'Mucuri', 'Nova Vicosa', 'Prado', 'Teixeira de Freitas', 'Vereda'
  ],
  'Medio Sudoeste da Bahia': [
    'Caatiba', 'Firmino Alves', 'Ibicui', 'Iguai', 'Itambe', 'Itapetinga', 'Itarantim',
    'Itororo', 'Macarani', 'Maiquinique', 'Nova Canaa', 'Potiragua', 'Santa Cruz da Vitoria'
  ],
  'Vale do Jiquirica': [
    'Amargosa', 'Brejoes', 'Cravolandia', 'Elisio Medrado', 'Irajuba', 'Itaquara', 'Itirucu',
    'Jaguaquara', 'Jiquirica', 'Lafayette Coutinho', 'Laje', 'Lajedo do Tabocal', 'Maracas',
    'Milagres', 'Mutuipe', 'Nova Itarana', 'Planaltino', 'Santa Ines', 'Sao Miguel das Matas', 'Ubaira'
  ],
  'Sertao do Sao Francisco': [
    'Campo Alegre de Lourdes', 'Canudos', 'Casa Nova', 'Curaca', 'Juazeiro', 'Pilao Arcado',
    'Remanso', 'Sento Se', 'Sobradinho', 'Uaua'
  ],
  'Bacia do Rio Grande': [
    'Angical', 'Baianopolis', 'Barreiras', 'Buritirama', 'Catolandia', 'Cotegipe', 'Cristopolis',
    'Formosa do Rio Preto', 'Luis Eduardo Magalhaes', 'Mansidao', 'Riachao das Neves',
    'Santa Rita de Cassia', 'Sao Desiderio', 'Wanderley'
  ],
  'Bacia do Paramirim': [
    'Boquira', 'Botupora', 'Caturama', 'Erico Cardoso', 'Ibipitanga', 'Macaubas', 'Paramirim', 'Rio do Pires'
  ],
  'Sertao Produtivo': [
    'Brumado', 'Cacule', 'Caetite', 'Candiba', 'Contendas do Sincora', 'Dom Basilio', 'Guanambi',
    'Ibiassuce', 'Ituacu', 'Iuiu', 'Lagoa Real', 'Livramento de Nossa Senhora', 'Malhada de Pedras',
    'Palmas de Monte Alto', 'Pindai', 'Rio do Antonio', 'Sebastiao Laranjeiras', 'Tanhacu',
    'Tanque Novo', 'Urandi'
  ],
  'Piemonte do Paraguacu': [
    'Boa Vista do Tupim', 'Iacu', 'Ibiquera', 'Itaberaba', 'Itatim', 'Lajedinho', 'Macajuba',
    'Mundo Novo', 'Piritiba', 'Rafael Jambeiro', 'Ruy Barbosa', 'Santa Terezinha', 'Tapiramuta'
  ],
  'Bacia do Jacuipe': [
    'Baixa Grande', 'Capela do Alto Alegre', 'Capim Grosso', 'Gaviao', 'Ipira', 'Mairi',
    'Nova Fatima', 'Pe de Serra', 'Pintadas', 'Quixabeira', 'Riachao do Jacuipe',
    'Sao Jose do Jacuipe', 'Serra Preta', 'Varzea da Roca', 'Varzea do Poco'
  ],
  'Piemonte da Diamantina': [
    'Caem', 'Jacobina', 'Miguel Calmon', 'Mirangaba', 'Ourolandia', 'Saude', 'Serrolandia',
    'Umburanas', 'Varzea Nova'
  ],
  'Semiarido Nordeste II': [
    'Adustina', 'Antas', 'Banzae', 'Cicero Dantas', 'Cipo', 'Coronel Joao Sa',
    'Euclides da Cunha', 'Fatima', 'Heliopolis', 'Jeremoabo', 'Nova Soure', 'Novo Triunfo',
    'Paripiranga', 'Pedro Alexandre', 'Ribeira do Amparo', 'Ribeira do Pombal',
    'Santa Brigida', 'Sitio do Quinto'
  ],
  'Litoral Norte e Agreste Baiano': [
    'Acajutiba', 'Alagoinhas', 'Apora', 'Aracas', 'Aramari', 'Cardeal da Silva', 'Catu',
    'Conde', 'Crisopolis', 'Entre Rios', 'Esplanada', 'Inhambupe', 'Itanagra', 'Itapicuru',
    'Jandaira', 'Olindina', 'Ouricangas', 'Pedrao', 'Rio Real', 'Satiro Dias'
  ],
  'Portal do Sertao': [
    'Agua Fria', 'Amelia Rodrigues', 'Anguera', 'Antonio Cardoso', 'Conceicao da Feira',
    'Conceicao do Jacuipe', 'Coracao de Maria', 'Feira de Santana', 'Ipecaeta', 'Irara',
    'Santa Barbara', 'Santanopolis', 'Santo Estevao', 'Sao Goncalo dos Campos', 'Tanquinho',
    'Teodoro Sampaio', 'Terra Nova'
  ],
  'Sudoeste Baiano': [
    'Anage', 'Aracatu', 'Barra do Choca', 'Belo Campo', 'Bom Jesus da Serra', 'Caetanos',
    'Candido Sales', 'Caraibas', 'Condeuba', 'Cordeiros', 'Encruzilhada', 'Guajeru', 'Jacaraci',
    'Licinio de Almeida', 'Maetinga', 'Mirante', 'Mortugaba', 'Piripa', 'Planalto', 'Pocoes',
    'Presidente Janio Quadros', 'Ribeirao do Largo', 'Tremedal', 'Vitoria da Conquista'
  ],
  'Reconcavo': [
    'Cabaceiras do Paraguacu', 'Cachoeira', 'Castro Alves', 'Conceicao do Almeida',
    'Cruz das Almas', 'Dom Macedo Costa', 'Governador Mangabeira', 'Maragogipe',
    'Muniz Ferreira', 'Muritiba', 'Nazare', 'Salinas da Margarida', 'Santo Amaro',
    'Santo Antonio de Jesus', 'Sao Felipe', 'Sao Felix', 'Sapeacu', 'Saubara', 'Varzedo'
  ],
  'Medio Rio de Contas': [
    'Aiquara', 'Apuarema', 'Barra do Rocha', 'Boa Nova', 'Dario Meira', 'Gongogi', 'Ibirataia',
    'Ipiau', 'Itagi', 'Itagiba', 'Itamari', 'Jequie', 'Jitauna', 'Manoel Vitorino', 'Nova Ibia', 'Ubata'
  ],
  'Bacia do Rio Corrente': [
    'Brejolandia', 'Canapolis', 'Cocos', 'Coribe', 'Correntina', 'Jaborandi',
    'Santa Maria da Vitoria', 'Santana', 'Sao Felix do Coribe', 'Serra Dourada', 'Tabocas do Brejo Velho'
  ],
  'Itaparica': ['Abare', 'Chorrocho', 'Gloria', 'Macurure', 'Paulo Afonso', 'Rodelas'],
  'Piemonte Norte do Itapicuru': [
    'Andorinha', 'Antonio Goncalves', 'Caldeirao Grande', 'Campo Formoso', 'Filadelfia',
    'Jaguarari', 'Pindobacu', 'Ponto Novo', 'Senhor do Bonfim'
  ],
  'Metropolitano de Salvador': [
    'Camacari', 'Candeias', "Dias d'Avila", 'Itaparica', 'Lauro de Freitas', 'Madre de Deus',
    'Mata de Sao Joao', 'Pojuca', 'Salvador', 'Sao Francisco do Conde', 'Sao Sebastiao do Passe',
    'Simoes Filho', 'Vera Cruz'
  ],
  'Costa do Descobrimento': [
    'Belmonte', 'Eunapolis', 'Guaratinga', 'Itabela', 'Itagimirim', 'Itapebi', 'Porto Seguro',
    'Santa Cruz Cabralia'
  ]
};

const TERRITORY_ALIASES = {
  'itapetinga': 'Medio Sudoeste da Bahia',
  'vitoria da conquista': 'Sudoeste Baiano',
  'metropolitana de salvador': 'Metropolitano de Salvador',
  'recôncavo': 'Reconcavo',
  'irece': 'Irece'
};

export function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalTerritoryKey(territory) {
  const normalized = normalizeText(territory);
  if (!normalized) return '';

  const aliasMatch = TERRITORY_ALIASES[normalized];
  if (aliasMatch) return aliasMatch;

  const direct = Object.keys(BAHIA_TERRITORY_MUNICIPALITIES).find(
    (entry) => normalizeText(entry) === normalized
  );

  return direct || '';
}

function toSearchableText(item) {
  return normalizeText(
    Object.values(item || {})
      .map((value) => {
        if (Array.isArray(value)) return value.join(' ');
        if (value && typeof value === 'object') return JSON.stringify(value);
        return String(value || '');
      })
      .join(' ')
  );
}

export function getMunicipalitiesByTerritory(territory) {
  const key = canonicalTerritoryKey(territory);
  if (!key) return [];
  return BAHIA_TERRITORY_MUNICIPALITIES[key] || [];
}

function hasBahiaHint(text) {
  return /\bbahia\b/.test(text) || /\/ba\b/.test(text);
}

export function buildLocationSeedQuery(territory, municipality) {
  const territoryName = canonicalTerritoryKey(territory);
  const municipalities = getMunicipalitiesByTerritory(territoryName);
  const city = normalizeText(municipality);

  if (city) {
    return `${city} bahia`;
  }

  if (territoryName && municipalities.length > 0) {
    // Usa cidades representativas para auxiliar o pré-filtro no upstream.
    return `${normalizeText(municipalities[0])} bahia`;
  }

  return territoryName ? `${normalizeText(territoryName)} bahia` : '';
}

export function locationMatchesBahia(item, filters = {}) {
  const text = toSearchableText(item);
  if (!text) return false;

  const cityFilter = normalizeText(filters.municipality);
  const territoryMunicipalities = getMunicipalitiesByTerritory(filters.territory).map(normalizeText);

  const cityMatches = !cityFilter || text.includes(cityFilter);
  const territoryMatches =
    territoryMunicipalities.length === 0 || territoryMunicipalities.some((city) => text.includes(city));

  if (!cityFilter && territoryMunicipalities.length === 0) {
    return true;
  }

  // Evita falsos positivos com nomes de cidade repetidos em outros estados.
  const inBahiaContext = hasBahiaHint(text);

  if (cityFilter && territoryMunicipalities.length > 0) {
    return cityMatches && territoryMatches;
  }

  return cityMatches && territoryMatches && inBahiaContext;
}

export function filterItemsByBahiaLocation(items = [], filters = {}) {
  if (!filters?.territory && !filters?.municipality) return items;
  return items.filter((item) => locationMatchesBahia(item, filters));
}

export const BAHIA_TERRITORIES = Object.keys(BAHIA_TERRITORY_MUNICIPALITIES);

export const BAHIA_MUNICIPALITY_SUGGESTIONS = Array.from(
  new Set(Object.values(BAHIA_TERRITORY_MUNICIPALITIES).flat())
).sort((a, b) => a.localeCompare(b, 'pt-BR'));
