# TODO

-   FAIRE LE RESPONSIVE AU FUR EST A MESURE IMPORTANT

-   Faire le modal de board

    -   Regler le probleme de couche textarea / div / ou trouver un autre moyen avec React plus propre
    -   Pouvoir mettre les mots en gras qui une etoile est devant
    -   Voir pour enlever les espacements (encodé en html ? se renseigner) etc... pour stocker en db et la decode pour le front
    -   Faire l'emoji picker

    -   Pouvoir quitter et supprimer un board
    -   Faire le typages interface etc... typescript
    -   Formater la date de creation du board (et les futurs autres dates)

-   Revoir les focus css et le mixin bouton (et hover ?) pour faire + stylé ? AU PLUS VITE AVANT d'avoir trop de truc
-   Gerer les permissions du board (et se faire un role admin pour tout les boards)

-   Voir les erreurs serveur aussi.
-   Voir ce qu'on peut faire avec les user id du socket io
-   Voir pour verififer si le user est co autrement (useAuth ?)

---

-   FAIRE LES CHOSES PROPREMENT AVANT DE COMMENCER LES TABLEAUX

---

-   Faire un mini chat entre membre
-   Faire les boards :

    -   crée les tableaux du board ( avec le bouton pour crée une nouvelle liste en dessous de chaque tableau et a gauche du dernier pour crée un nouveau tableau)

-   Voir pourquoi le token se crée 2 fois (pas tres grave ?)
-   Faire fonctionner la barre de recherche (pour trouver un board ? et autres a voir...) + revoir son dropdown
-   Mettre les transition toast dans le composant toast item
-   Faire les loaders skelett(reutilisable bien sur) ???
-   Supprimer les (nouvelles) images
-   Voir son profil (+ modifier etc...)
-   Voir pour verifier autrement si le user est connecté pour le routeur ou autre
-   Afficher page erreur (page stylé ?) si le user est sur la page d'un board alors qu'il est pas dedans + gerer les autres potentiels erreurs

-   Faire des types de notifications (pour reutilisé et faire un affichage different selon le type)
    exemple (BOARD_INVITATION , INFORMATION , FRIEND_INVITATION etc...)
    -   Faire un lien pour rejoindre un board ? (BONUS)
