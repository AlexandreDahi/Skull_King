# Etat de l'art sur les bibliothèques existantes pour réaliser le forntend de SkullKing

## Les tableaux

### Tableu récapitulatif de 3 technologies : Konva, PixiJS et Phaser. 

| Technologie           | Exemple de jeu / projet               | Description / lien                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Konva (canvas 2D)** | *Animals on the Beach*                | Démo officielle de Konva : glisser-déposer des animaux sur leur silhouette. ([konvajs.org][1])  <br>Voir la sandbox Konva : ([CodeSandbox][2])  <br>                                                                                                                                                                                                         |
| **PixiJS**            | *Solitaire (reconstruit avec PixiJS)* | Quelqu’un a refait un jeu de **Solitaire / Patience** avec PixiJS, soulignant la fluidité des animations (~120 fps). ([Reddit][3])  <br>Autre projet éducatif : “Ace of Shadows” — un “Automated card dealing system” avec PixiJS. ([DEV Community][4])  <br>Collection open-source de jeux PixiJS : “PixiJS Open Games” (avec plusieurs jeux) ([GitHub][5]) |
| **Phaser**            | *Phaser Staff Picks*                  | Sur le site officiel de Phaser : une page “Featured Games” avec des jeux variés construits avec Phaser. ([phaser.io][6])  <br>Exemples + playground Phaser : les “Examples” sur le site Phaser (scènes, animations, input…) ([phaser.io][7])  <br>CodeSandbox avec des templates de jeu Phaser : ([CodeSandbox][8])                                          |

[1]: https://konvajs.org/docs/sandbox/Animals_on_the_Beach_Game.html?utm_source=chatgpt.com "Animals on the Beach Game | Konva - JavaScript Canvas 2d Library"
[2]: https://codesandbox.io/examples/package/konva?utm_source=chatgpt.com "konva examples"
[3]: https://www.reddit.com/r/pixijs/comments/1ffbpuq/i_rebuilt_my_solitaire_game_using_pixijs/?utm_source=chatgpt.com "I rebuilt my Solitaire game using Pixi.js : r/pixijs"
[4]: https://dev.to/rubemfsv/pixijs-implementing-core-gaming-concepts-438j?utm_source=chatgpt.com "PixiJS: Implementing Core Gaming Concepts"
[5]: https://github.com/pixijs/open-games?utm_source=chatgpt.com "pixijs/open-games"
[6]: https://phaser.io/games?utm_source=chatgpt.com "Phaser - Featured Games"
[7]: https://phaser.io/examples?utm_source=chatgpt.com "Examples"
[8]: https://codesandbox.io/examples/package/phaser?utm_source=chatgpt.com "phaser examples"

### Tableau récapitulatif des techno utilisé par les jeux en lignes classique :

| Jeu / Plateforme                                    | Technologie Frontend Principale | Compléments / Notes                           |
| --------------------------------------------------- | ------------------------------- | --------------------------------------------- |
| **PokerStars (desktop)**                            | **C++ + OpenGL/DirectX**        | Client natif, pas Web                         |
| **PokerStars Web**                                  | **WebGL + TypeScript**          | Moteur custom + React pour menus              |
| **UNO (Ubisoft / mobile)**                          | **Unity (C#)**                  | Export multi-plateforme                       |
| **UNO Web (versions non officielles)**              | **Phaser, PixiJS**              | Idéal pour animations de cartes               |
| **Board Game Arena**                                | **WebGL + moteur maison JS/TS** | Très optimisé, pas de framework web classique |
| **Tabletopia**                                      | **Unity WebGL**                 | Graphismes riches 3D                          |
| **Jeux de société classiques (Yucata, BoiteAJeux)** | **JavaScript pur, jQuery**      | Style minimaliste                             |
| **Jeux web “pro” modernes**                         | **React + WebGL/PixiJS**        | Courant dans les studios actuels              |


### Tableau pour départager les techno :

| Critère                                         | **Konva**                        | **PixiJS**                                   | **Phaser**                                    |
| ----------------------------------------------- | -------------------------------- | -------------------------------------------- | --------------------------------------------- |
| **Catégorie**                                   | Librairie Canvas 2D              | Moteur rendu 2D WebGL                        | Moteur de jeu complet 2D                      |
| **Performance**                                 | ⭐⭐☆☆☆ (bonne mais limitée)       | ⭐⭐⭐⭐⭐ (très hautes perfs)                    | ⭐⭐⭐⭐☆ (excellentes)                           |
| **Difficulté**                                  | ⭐☆☆☆☆ (simple)                   | ⭐⭐☆☆☆ (moyenne)                              | ⭐⭐⭐☆☆ (plus complexe)                         |
| **Animations**                                  | Simples (tweens basiques)        | Très fluides, effets avancés                 | Avancées, scènes, timeline                    |
| **Structure de jeu** (scènes, assets, loaders…) | ❌ aucune                         | ❌ partielle (à implémenter soi-même)         | ✔ complète                                    |
| **Drag & Drop**                                 | ✔ natif, très facile             | ✔ mais à programmer                          | ✔ intégré                                     |
| **Gestion des collisions**                      | ❌ non                            | ❌ non                                        | ✔ moteur physique optionnel                   |
| **Adapté aux jeux de cartes**                   | ✔ Très adapté (simple dynamique) | ✔ Parfait (rendu fluide, animations propres) | ✔ Oui mais plus que nécessaire                |
| **Adapté aux jeux complexes**                   | ❌ non                            | ⭐⭐☆☆☆                                        | ⭐⭐⭐⭐⭐ (plateaux complexes, animations, multi) |
| **Courbe d’apprentissage**                      | Très faible                      | Moyenne                                      | Haute                                         |
| **Intégration Angular**                         | ⭐⭐⭐⭐☆ facile via ngx-konva       | ⭐⭐☆☆☆ (custom wrappers)                      | ⭐⭐☆☆☆ (via service et canvas)                 |
| **Taille / poids**                              | Léger (~100 kB)                  | Moyen (~500 kB)                              | Plus lourd (1–2 MB)                           |
| **Communauté / support**                        | Bonne                            | Très grande                                  | Énorme                                        |
| **Cas d’usage typiques**                        | Jeux simples, outils graphiques  | Jeux 2D rapides, animés                      | Jeux complets style arcade / plateau          |
| **Rendu visuel**                                | Basique mais propre              | Très beau, professionnel                     | Très pro (moteur complet)                     |

## Partie reflexion sur chaque techno :

### Phaser : 

- Recommandation de ne pas intégrer directement Phaser dans Angular à cause du fonctionnement des technos, ce n'est pas pratique, dure à faire et fragile. **Beaucoup de problèmes**

- Ne pas intégrer Phaser directement dans Angular : séparer en micro-services; Angular = UI (menu,login,gestion des parties) et Phaser= le jeu (canvas séparer)

- Faire d'autres truck, Phaser + Web Component

- iFrame possible

- Faire Phaser + React **Moins de problèmes**

### Konva :

- On peut faire pareil que pour Phaser, par contre s'intègre très très bien avec Angular

- Rendu plus simple, moteur de jeux plus basique

### PixiJS

- Solution recommandé : **Isoler Pixis dans un Web component**

- Option 2 — PixiJS autonome dans une page Angular. Tu crées une page /game dans Angular, puis dans ngAfterViewInit() :

- Pareil, PixiJS et **React** ça marche beaucoup mieux.

- iFrame possible