# TODO

-   IMPORTANT FAIRE D'ABORD LES FEATURES INDISPENSABLE (DEMANDER)
-   ET AMELIORER L'APP ET LES FEATURES A LA FIN !

UPLOAD LE SITE SUR HEROKU JE FINIRAIS LES DERNIERES FEATURES PLUS TARD (et chose a faire etc...)
PUSH SUR GIT HUB LA NOUVELLE VERSION

-   Voir pourquoi on voit le json quand on actualise sur un board (en prod);
-   tester voir si y'a pas d'autre souci
-   Faire un truc propre pour switch le mode production (env)
-   GO METTRE SUR HEROKU !!

-   Features a faire :

    -   Gerer les tailles des nom des label
    -   Créer un composant pour Upload une image (avec API unSplash) le mettre pour crée un board aussi ;
    -   Faire le modal responsive

-   Gerer les probleme React d'async cleanup
-   Reajuster le scss pour faire un truc propre (mais si ça ne correspond pas exactement au figma) (card modal en premier)
-   Delete une card

-   Voir pourquoi la derniere liste ne se supprime pas sur le front
-   Rendre le drag scroll plus rapide (la factoriser un max pour le fun :)
-   Enlever le overflow-y : auto sur list-content permet de suivre le scroll horizontal
-   Voir pourquoi le placeholder est buggé quand il y'a plein de label

-   Voir pour regler bug graphique dropdown
-   Appeller l'api unsplash pour les images
-   Mettre mon blaze dans le header (made by Alex) ou footer a voir...

---

---

---

---

-   Faire un read more pour les description / long texte
-   Regler le chargement d'un board quand on est deja sur l'URL (chargement s'arrete avant d'avoir tout charger)
-   Gerer les noms de card et de list trop longue (overflow-y);

-   Faire l'emoji picker
-   Faire un mini chat entre membre
-   Faire les boards :

    -   crée les tableaux du board ( avec le bouton pour crée une nouvelle liste en dessous de chaque tableau et a gauche du dernier pour crée un nouveau tableau)

-   Faire des verification sur les perms en back pour tout ce need de modifer une donnée
-   Voir pourquoi le token se crée 2 fois (pas tres grave ?)
-   Faire fonctionner la barre de recherche (pour trouver un board ? et autres a voir...) + revoir son dropdown
-   Mettre les transition toast dans le composant toast item
-   Supprimer les (nouvelles) images
-   Voir son profil (+ modifier etc...)
-   Voir pour verifier autrement si le user est connecté pour le routeur ou autre
-   Afficher page erreur (page stylé ?) si le user est sur la page d'un board alors qu'il est pas dedans + gerer les autres potentiels erreurs
-   Voir ce qu'on peut faire avec les user id du socket io
-   Voir pour verififer si le user est co autrement (useAuth ?)
-   Faire des types de notifications (pour reutilisé et faire un affichage different selon le type)
    exemple (BOARD_INVITATION , INFORMATION , FRIEND_INVITATION etc...)
    -   Faire un lien pour rejoindre un board ? (BONUS)