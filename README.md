# Application de Gestion des Talents

Le projet Talent Management est réalisé par Tawfik Brahim & Mehrez Ganouchi.

## Table des Matières
- [Description](#description)
- [BI Dashboard](#bi-dashboard)
- [Démarrage](#démarrage)
- [Installation](#installation)
  - [Talent-Management-recommender](#talent-management-recommender)
  - [Talent-Management-web](#talent-management-web)
    - [Application React](#application-react)
    - [Serveur Node](#serveur-node)
    - [Serveur Flask](#serveur-flask)
- [Utilisation](#utilisation)
- [Fonctionnalités (Documentation)](#fonctionnalités-documentation)
  - [Talent-Management-recommender](#talent-management-recommender)
  - [Backend Node Server](#backend-node-server)
  - [Flask Server for graphs](#flask-server-for-graphs)
  - [Services React](#services-react)
- [Contact](#contact)

## Description

L'application de gestion des talents est divisée en deux composants principaux :
- **Talent-Management-recommender** : Contient des fonctionnalités d'IA générative, exécutées sur un serveur Flask.
- **Talent-Management-web** : Contient les serveurs frontend et backend, y compris une application React, un serveur Node, et un autre serveur Flask.

## BI Dashboard

Télécharger les [BI Dashboard](https://drive.google.com/drive/folders/1MWLQGpHlRjlkhzJc2Qa6_UJuS04LPfi7?usp=drive_link).

## Démarrage

Clonez le dépôt et accédez au répertoire principal :
```bash
git clone https://github.com/DorraBoutiti/PFE-Talan-2024-codes/tree/TalentManagment---Tawfik-Brahim-&-Mehrez-Gannouchi
cd TalentManagment
```
Avant de démarrer le projet, assurez-vous d'ajouter votre clé API OpenAI dans le fichier hidden.txt. Voici comment procéder :

1. Accédez aux répertoires `Talent-Management-recommender` et `Talent-Management-web/flask-server`.

2. Créez un fichier nommé `hidden.txt` dans chaque répertoire s'il n'existe pas déjà.

3. Ajoutez votre clé API OpenAI dans le fichier `hidden.txt`.

4. Assurez-vous que les fichiers `hidden.txt` ne sont pas inclus dans vos commits pour des raisons de sécurité.

5. Vous devez télécharger quelques fichiers volumineux et les ajouter aux emplacements indiqués :
   [data.csv](https://drive.google.com/file/d/1EKZMRAjWzY-PRyn_V9tou98IeaerTUIl/view?usp=sharing) to .\Talent-Management-recommender
   [fact_personnel.csv](https://drive.google.com/file/d/1Twu1e51iqEU8ULUb4iQN61WcrQZjqEYW/view?usp=drive_link) to .\Talent-Management-web\flask-server\csvs
   [Table_Évaluationl.csv](https://drive.google.com/file/d/1ZEGKUs_wdW3xgBcx652dpS6uVUwGL7Ze/view?usp=drive_link) to .\Talent-Management-web\flask-server\csvs

## Installation

### Talent-Management-recommender

1. Clonez le dépôt et accédez au répertoire `talent-management-recommender` :
    ```bash
    cd Talent-Management-recommender
    ```

2. Créez un environnement virtuel s'il n'existe pas :
    - Sous Linux :
        ```bash
        python3 -m venv env
        ```
    - Sous Windows :
        ```cmd
        python -m venv env
        ```

3. Activez l'environnement virtuel :
    - Sous Linux :
        ```bash
        source env/bin/activate
        ```
    - Sous Windows :
        ```cmd
        .\env\Scripts\activate
        ```

4. Installez les packages requis :
    ```bash
    pip install -r requirements.txt
    ```

5. Exécutez le serveur Flask :
    ```bash
    python app.py
    ```
    Le serveur fonctionnera sur le port 4000.

### Talent-Management-web

#### Application React
1. Accédez au répertoire `talent-management-recommender` :
    ```bash
    cd Talent-Management-web
    ```

2. Accédez au répertoire `react-app` :
    ```bash
    cd react-app
    ```

3. Installez les dépendances et démarrez l'application :
    ```bash
    npm install
    npm run start
    ```
    Ou avec yarn :
    ```bash
    yarn install
    yarn start
    ```
    L'application fonctionnera sur le port 3000.

#### Serveur Node

1. Accédez au répertoire `node-server` :
    ```bash
    cd node-server
    ```

2. Installez les dépendances et démarrez le serveur :
    ```bash
    npm install
    npm start
    ```
    Le serveur fonctionnera sur le port 5000.

#### Serveur Flask

1. Accédez au répertoire `flask-server` :
    ```bash
    cd flask-server
    ```

2. Créez un environnement virtuel s'il n'existe pas :
    - Sous Linux :
        ```bash
        python3 -m venv venv
        ```
    - Sous Windows :
        ```cmd
        python -m venv venv
        ```

3. Activez l'environnement virtuel :
    - Sous Linux :
        ```bash
        source venv/bin/activate
        ```
    - Sous Windows :
        ```cmd
        .\venv\Scripts\activate
        ```

4. Installez les packages requis :
    ```bash
    pip install -r requirements.txt
    ```

5. Exécutez le serveur Flask :
    ```bash
    flask run
    ```
    Le serveur fonctionnera sur le port 4000.

## Utilisation

Pour utiliser l'application de gestion des talents, assurez-vous que tous les serveurs sont en cours d'exécution comme décrit dans la section d'installation. Vous pouvez ensuite accéder au frontend via l'application React fonctionnant sur **http://localhost:3000/talan-hr/**.

## Fonctionnalités (Documentation)

### Talent-Management-recommender : flask server (port 4500)
Le composant Talent-Management-recommender contient trois fonctionnalités principales :

1. **Recommandation de Personnel**:
    - Fonctionne avec des modèles de langage génératifs (LLMs) ou OpenAI (nécessite une clé OpenAI).
    - Dans notre cas, il utilise OpenAI pour une exécution plus rapide.
    - Accessible à l'endpoint [POST] `/api/` sur le port 4500.
    - La réponse est générée et stockée dans un fichier JSON nommé 'byText.json'.

2. **Recommandation de Parcours Professionnel**:
    - Fonctionne également avec des modèles de langage génératifs (LLMs) ou OpenAI.
    - Utilise OpenAI pour une exécution plus rapide.
    - Accessible à l'endpoint [POST] `/api2/` sur le port 4500.
    - La réponse est générée et stockée dans un fichier JSON nommé 'byText.json'.

3. **Matching d'Emploi**:
    - Utilise un modèle de langage génératif (LLM) pour encoder et générer des réponses, ainsi qu'OpenAI pour une amélioration supplémentaire.
    - Accessible à l'endpoint [POST] `/api-matching/` sur le port 4500.
    - La réponse est générée et stockée dans un fichier JSON nommé 'byText.json'.

## Backend Node Server : Talent-Management-web\node-server (port 5000) : 

### Réinitialisation de Mot de Passe

#### Demande de Lien de Réinitialisation de Mot de Passe

- **URL:** `/reset`
- **Méthode:** `POST`
- **Description:** Envoie un lien de réinitialisation de mot de passe à l'adresse e-mail de l'utilisateur.
- **Corps de la Requête:**
  - `email`: Adresse e-mail de l'utilisateur.
- **Réponse:**
  - `200 OK`: Lien de réinitialisation de mot de passe envoyé avec succès.
  - `400 Bad Request`: E-mail invalide ou utilisateur non trouvé.
  - `500 Internal Server Error`: Erreur du serveur.

#### Vérification du Lien de Réinitialisation de Mot de Passe

- **URL:** `/reset/:id/:token`
- **Méthode:** `GET`
- **Description:** Vérifie le lien de réinitialisation de mot de passe.
- **Paramètres:**
  - `id`: ID de l'utilisateur.
  - `token`: Token généré pour la réinitialisation de mot de passe.
- **Réponse:**
  - `200 OK`: URL valide.
  - `400 Bad Request`: Lien invalide.
  - `500 Internal Server Error`: Erreur du serveur.

#### Définition du Nouveau Mot de Passe

- **URL:** `/reset/:id/:token`
- **Méthode:** `POST`
- **Description:** Définit un nouveau mot de passe pour l'utilisateur.
- **Paramètres:**
  - `id`: ID de l'utilisateur.
  - `token`: Token généré pour la réinitialisation de mot de passe.
- **Corps de la Requête:**
  - `password`: Nouveau mot de passe.
- **Réponse:**
  - `200 OK`: Mot de passe réinitialisé avec succès.
  - `400 Bad Request`: Lien invalide ou erreur de validation.
  - `500 Internal Server Error`: Erreur du serveur.

### Gestion des Utilisateurs

#### Création d'Utilisateur

- **URL:** `/user/create`
- **Méthode:** `POST`
- **Description:** Crée un nouveau compte utilisateur.
- **Corps de la Requête:**
  - `firstname`: Prénom de l'utilisateur.
  - `lastname`: Nom de famille de l'utilisateur.
  - `email`: Adresse e-mail de l'utilisateur.
  - `password`: Mot de passe de l'utilisateur.
  - `dep`: Département de l'utilisateur.
  - `pos`: Poste de l'utilisateur.
- **Réponse:**
  - `201 Created`: Nouvel utilisateur créé avec succès.
  - `400 Bad Request`: Erreur dans le corps de la requête ou utilisateur existe déjà.
  - `500 Internal Server Error`: Erreur du serveur.

#### Obtention de Tous les Utilisateurs

- **URL:** `/user/getall`
- **Méthode:** `GET`
- **Description:** Récupère tous les utilisateurs.
- **Réponse:**
  - `200 OK`: Liste des utilisateurs.
  - `500 Internal Server Error`: Erreur du serveur.

#### Obtention de l'Utilisateur par ID

- **URL:** `/user/get/:id`
- **Méthode:** `GET`
- **Description:** Récupère un utilisateur par ID.
- **Paramètres:**
  - `id`: ID de l'utilisateur.
- **Réponse:**
  - `200 OK`: Détails de l'utilisateur.
  - `404 Not Found`: Utilisateur non trouvé.
  - `500 Internal Server Error`: Erreur du serveur.

#### Mise à Jour de l'Utilisateur par ID

- **URL:** `/user/update/:id`
- **Méthode:** `PATCH`
- **Description:** Met à jour un utilisateur par ID.
- **Paramètres:**
    - `id`: ID de l'utilisateur.
- **Corps de la Requête:** Détails de l'utilisateur mis à jour.
- **Réponse:**
  - `200 OK`: Détails de l'utilisateur mis à jour.
  - `404 Not Found`: Utilisateur non trouvé.
  - `400 Bad Request`: Erreur dans le corps de la requête.
  - `500 Internal Server Error`: Erreur du serveur.

#### Réinitialisation du Mot de Passe

- **URL:** `/user/reset-password`
- **Méthode:** `POST`
- **Description:** Réinitialise le mot de passe pour l'utilisateur connecté.
- **Autorisation:** Token Bearer.
- **Corps de la Requête:**
  - `password`: Nouveau mot de passe.
- **Réponse:**
  - `200 OK`: Réinitialisation du mot de passe réussie.
  - `400 Bad Request`: Erreur de validation.
  - `404 Not Found`: Utilisateur non trouvé.
  - `500 Internal Server Error`: Erreur du serveur.

#### Obtention du Profil

- **URL:** `/user/profile`
- **Méthode:** `GET`
- **Description:** Récupère le profil de l'utilisateur connecté.
- **Autorisation:** Token Bearer.
- **Réponse:**
  - `200 OK`: Détails du profil de l'utilisateur.
  - `404 Not Found`: Utilisateur non trouvé.
  - `500 Internal Server Error`: Erreur du serveur.

#### Mise à Jour du Profil

- **URL:** `/user/profile`
- **Méthode:** `PATCH`
- **Description:** Met à jour le profil de l'utilisateur connecté.
- **Autorisation:** Token Bearer.
- **Corps de la Requête:** Détails de l'utilisateur mis à jour.
- **Réponse:**
  - `200 OK`: Profil utilisateur mis à jour.
  - `404 Not Found`: Utilisateur non trouvé.
  - `400 Bad Request`: Erreur dans le corps de la requête.
  - `500 Internal Server Error`: Erreur du serveur.

#### Déconnexion

- **URL:** `/user/logout`
- **Méthode:** `POST`
- **Description:** Déconnecte l'utilisateur.
- **Autorisation:** Token Bearer.
- **Réponse:**
  - `200 OK`: Déconnexion réussie.
  - `401 Unauthorized`: Le token est blacklisté. Veuillez vous reconnecter.

## Flask Server for graphs : Talent-Management-web\flask-server (port 4000) : 
Le composant Talent-Management-recommender contient les routes suivantes :

### RAG

#### Message RAG

- **URL:** `/rag/message`
- **Méthode:** `POST`
- **Description:** Reçoit un message de l'interface utilisateur et retourne la réponse du bot.
- **Corps de la Requête:** 
  - `message`: Message de l'utilisateur.
- **Réponse:** 
  - `message`: Réponse du bot.

### Données Radar

#### Données Radar

- **URL:** `/radar-data`
- **Méthode:** `POST`
- **Description:** Récupère les données radar pour deux employés.
- **Corps de la Requête:** 
  - `employee1_id`: ID du premier employé.
  - `employee2_id`: ID du deuxième employé.
- **Réponse:** 
  - `common_competencies`: Compétences communes entre les deux employés.
  - `levels_employee1`: Niveaux des compétences pour le premier employé.
  - `levels_employee2`: Niveaux des compétences pour le deuxième employé.

### Matricules

#### Obtention des Matricules

- **URL:** `/matricules`
- **Méthode:** `GET`
- **Description:** Récupère la liste des matricules des employés.
- **Réponse:** 
  - Liste des matricules des employés.

### Données du Bar Chart

#### Données du Bar Chart

- **URL:** `/barchartdata`
- **Méthode:** `POST`
- **Description:** Récupère les données pour générer un graphique en barres comparant deux employés.
- **Corps de la Requête:** 
  - `employee1_id`: ID du premier employé.
  - `employee2_id`: ID du deuxième employé.
- **Réponse:** 
  - `common_competences`: Compétences communes entre les deux employés.
  - `levels_employee1`: Niveaux des compétences pour le premier employé.
  - `levels_employee2`: Niveaux des compétences pour le deuxième employé.
    
## Services React : Talent-Management-web\react-app (port 3000)

### Service d'Authentification

Ce service fournit des fonctions pour gérer l'authentification des utilisateurs.

#### Fonctions

##### `verify_password_reset_link(id, token)`

Vérifie le lien de réinitialisation de mot de passe.

- `id`: ID de l'utilisateur.
- `token`: Token généré pour la réinitialisation de mot de passe.
- **Route Backend:** Utilise le port 5000 avec la route `/reset/:id/:token`.
- **Retourne:** Résultat de la vérification.

##### `setNewPassword(id, token, password)`

Définit un nouveau mot de passe pour l'utilisateur.

- `id`: ID de l'utilisateur.
- `token`: Token généré pour la réinitialisation de mot de passe.
- `password`: Nouveau mot de passe.
- **Route Backend:** Utilise le port 5000 avec la route `/reset/:id/:token`.
- **Retourne:** Résultat de la définition du nouveau mot de passe.

##### `password_reset(email)`

Envoie un e-mail de réinitialisation de mot de passe à l'adresse e-mail de l'utilisateur.

- `email`: Adresse e-mail de l'utilisateur.
- **Route Backend:** Utilise le port 5000 avec la route `/reset`.
- **Retourne:** Résultat de l'envoi de l'e-mail de réinitialisation de mot de passe.

##### `setNewPass(password)`

Définit un nouveau mot de passe pour l'utilisateur connecté.

- `password`: Nouveau mot de passe.
- **Route Backend:** Utilise le port 5000 avec la route `/user/reset-password`.
- **Retourne:** Résultat de la définition du nouveau mot de passe.

##### `login(dataLogin)`

Connecte l'utilisateur.

- `dataLogin`: Données de connexion de l'utilisateur.
- **Route Backend:** Utilise le port 5000 avec la route `/user/login`.
- **Retourne:** Résultat de la connexion.

##### `signup(dataRegister)`

Inscrit un nouvel utilisateur.

- `dataRegister`: Données d'inscription de l'utilisateur.
- **Route Backend:** Utilise le port 5000 avec la route `/user/create`.
- **Retourne:** Résultat de l'inscription.

##### `logout()`

Déconnecte l'utilisateur.

- **Route Backend:** Utilise le port 5000 avec la route `/user/logout`.
- **Retourne:** Résultat de la déconnexion.

##### `getUserProfile()`

Récupère le profil de l'utilisateur connecté.

- **Route Backend:** Utilise le port 5000 avec la route `/user/profile`.
- **Retourne:** Profil de l'utilisateur connecté.

##### `updateUserProfile(userData)`

Met à jour le profil de l'utilisateur connecté.

- `userData`: Données de profil mises à jour de l'utilisateur.
- **Route Backend:** Utilise le port 5000 avec la route `/user/profile`.
- **Retourne:** Résultat de la mise à jour du profil de l'utilisateur connecté.

### Service de Vérification du Département

Ce service fournit une fonction pour vérifier le département de l'utilisateur.

#### Fonctions

##### `withAuthorization(WrappedComponent, requiredDep)`

Vérifie si l'utilisateur est autorisé à accéder au composant enveloppé en fonction de son département.

- `WrappedComponent`: Composant à envelopper.
- `requiredDep`: Département requis pour accéder au composant.
- **Retourne:** Composant enveloppé avec la vérification d'autorisation.


# Contact
Tawfik Brahim: 21 123 400 |   tawfikbrahim@yahoo.ca
Mehrez Ganouchi: 54 675 734 |   gannouchimehrez0411@gmail.com 
