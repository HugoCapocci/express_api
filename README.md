
Création d'une API REST avec Express
====================================

Méthode à suivre :
------------------
  * Forkez ce repository dans VOTRE github
  * Clonez **votre** repository 'forké'
  * Créez votre branche (`git checkout -b prenom-nom`) de travail
  * Faites régulièrement des commits, à chaque grande étape a minima
  * Pusher votre branche puis créez une Pull Request vers le repository maître, au plus tard en fin de journée


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