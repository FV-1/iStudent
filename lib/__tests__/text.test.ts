import { matchesQuery, normalizeText } from '@/lib/text';

describe('normalizeText', () => {
  it('supprime les accents et passe en minuscules', () => {
    expect(normalizeText('Bibliothèque Médiathèque')).toBe('bibliotheque mediatheque');
  });

  it('gère les majuscules accentuées', () => {
    expect(normalizeText('ÉVÉNEMENT')).toBe('evenement');
  });
});

describe('matchesQuery', () => {
  it('trouve un résultat malgré une saisie sans accent', () => {
    expect(matchesQuery(['Bibliothèque de Nantes'], 'bibliotheque')).toBe(true);
  });

  it('ignore la casse', () => {
    expect(matchesQuery(['Le Café Zébré'], 'CAFE')).toBe(true);
  });

  it('cherche dans tous les champs fournis', () => {
    expect(matchesQuery(['Titre', undefined, 'Rue de Verdun'], 'verdun')).toBe(true);
  });

  it('renvoie vrai sur une requête vide (aucun filtrage)', () => {
    expect(matchesQuery(['peu importe'], '   ')).toBe(true);
  });

  it('renvoie faux quand rien ne correspond', () => {
    expect(matchesQuery(['Bar', 'Rue de Verdun'], 'bibliotheque')).toBe(false);
  });

  it('tolère les champs absents', () => {
    expect(matchesQuery([undefined, undefined], 'test')).toBe(false);
  });
});
