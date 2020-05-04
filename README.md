
Création d'une API REST avec Express
====================================

Méthode à suivre :
------------------
  * Forkez ce repository dans VOTRE github
  * Clonez **votre** repository 'forké'
  * Créez votre branche (`git checkout -b prenom-nom`) de travail
  * Faites régulièrement des commits, à chaque grande étape a minima
  * Pusher votre branche puis créez une Pull Request vers le repository maître, au plus tard en fin de journée

Pour se synchroniser avec le repository "parent"
------------------------------------------------

  * Utilisez la commande `git fetch upstream` pour récupérer la branche master "parente"
  * En cas d'erreur "'upstream' does not appear to be a git repository" executer la commande suivante `git remote add upstream https://github.com/HugoCapocci/express_api.git` puis recommencez l'étape précédente
  * Allez sur votre branche master (qui doit être une copie de la branche master parente faite au moment du fork) via la commande `git checkout master` puis fusionnez-là avec la branche master qui vient de l'upstream, et mise à jour à la première étape : `git merge upstream/master`

Routes à créer :
----------------

Méthode	 | Action réalisée	                    | URI
-- | -- | --
GET	     | Récupération de tous les messages	| /api/v1/message
GET	     | Récuperation d'un seul message	    | /api/v1/message/{id}
POST	 | Creation d'un message	            | /api/v1/message
PUT	     | Modifier un message	                | /api/v1/message/{id}
DELETE	 | Effacer un message            	    | /api/v1/message/{id}

## Packages
- express
- body-parser
- mongodb
- dotenv