# Cahier de Recette - API de Conversion et Calculs Financiers

## Introduction

Ce document présente le cahier de recette pour l'API de Conversion et Calculs Financiers. Il contient les plans de test à exécuter pour valider le bon fonctionnement de l'application en local ou en environnement de développement.

## Informations générales

- **URL de l'API** : `http://localhost:3000`

## Plans de test

Les tests suivants doivent être exécutés pour valider le bon fonctionnement de l'API. Chaque test utilise la commande `curl` pour simuler une requête HTTP et vérifier la réponse.

### 1. Tests de disponibilité et informations

| ID | Description | Commande curl | Résultat attendu | Statut |
|----|-------------|---------------|-----------------|--------|
| T01 | Vérifier que l'API est accessible | `curl http://localhost:3000` | Réponse 200 avec message de bienvenue et liste des endpoints | ⬜ |
| T02 | Vérifier que l'API est accessible en HTTPS | `curl -k https://localhost:3000` | Réponse 200 avec message de bienvenue | ⬜ |
| T03 | Vérifier la réponse en cas de route inexistante | `curl http://localhost:3000/invalid-route` | Réponse 404 avec message d'erreur | ⬜ |

### 2. Tests de conversion de devises

| ID | Description | Commande curl | Résultat attendu | Statut |
|----|-------------|---------------|-----------------|--------|
| T04 | Conversion EUR vers USD avec montant valide | `curl "http://localhost:3000/convert?from=EUR&to=USD&amount=100"` | Réponse 200 avec montant converti | ⬜ |
| T05 | Conversion USD vers EUR avec montant valide | `curl "http://localhost:3000/convert?from=USD&to=EUR&amount=100"` | Réponse 200 avec montant converti | ⬜ |
| T06 | Conversion avec devise source invalide | `curl "http://localhost:3000/convert?from=XYZ&to=USD&amount=100"` | Réponse 400 avec message d'erreur | ⬜ |
| T07 | Conversion avec devise cible invalide | `curl "http://localhost:3000/convert?from=EUR&to=XYZ&amount=100"` | Réponse 400 avec message d'erreur | ⬜ |
| T08 | Conversion avec montant négatif | `curl "http://localhost:3000/convert?from=EUR&to=USD&amount=-100"` | Réponse 400 avec message d'erreur | ⬜ |
| T09 | Conversion avec montant non numérique | `curl "http://localhost:3000/convert?from=EUR&to=USD&amount=abc"` | Réponse 400 avec message d'erreur | ⬜ |
| T10 | Conversion sans spécifier le montant | `curl "http://localhost:3000/convert?from=EUR&to=USD"` | Réponse 400 avec message d'erreur | ⬜ |

### 3. Tests de calcul de TVA

| ID | Description | Commande curl | Résultat attendu | Statut |
|----|-------------|---------------|-----------------|--------|
| T11 | Calcul de TVA avec montant HT et taux valides | `curl "http://localhost:3000/tva?ht=100&taux=20"` | Réponse 200 avec montant TTC et TVA | ⬜ |
| T12 | Calcul de TVA avec taux différent | `curl "http://localhost:3000/tva?ht=100&taux=5.5"` | Réponse 200 avec montant TTC et TVA | ⬜ |
| T13 | Calcul de TVA avec montant HT négatif | `curl "http://localhost:3000/tva?ht=-100&taux=20"` | Réponse 400 avec message d'erreur | ⬜ |
| T14 | Calcul de TVA avec taux négatif | `curl "http://localhost:3000/tva?ht=100&taux=-20"` | Réponse 400 avec message d'erreur | ⬜ |
| T15 | Calcul de TVA sans spécifier le taux | `curl "http://localhost:3000/tva?ht=100"` | Réponse 400 avec message d'erreur | ⬜ |
| T16 | Calcul de TVA sans spécifier le montant HT | `curl "http://localhost:3000/tva?taux=20"` | Réponse 400 avec message d'erreur | ⬜ |

### 4. Tests de calcul de remise

| ID | Description | Commande curl | Résultat attendu | Statut |
|----|-------------|---------------|-----------------|--------|
| T17 | Calcul de remise avec prix et pourcentage valides | `curl "http://localhost:3000/remise?prix=100&pourcentage=10"` | Réponse 200 avec prix après remise | ⬜ |
| T18 | Calcul de remise avec pourcentage élevé | `curl "http://localhost:3000/remise?prix=100&pourcentage=50"` | Réponse 200 avec prix après remise | ⬜ |
| T19 | Calcul de remise avec prix négatif | `curl "http://localhost:3000/remise?prix=-100&pourcentage=10"` | Réponse 400 avec message d'erreur | ⬜ |
| T20 | Calcul de remise avec pourcentage négatif | `curl "http://localhost:3000/remise?prix=100&pourcentage=-10"` | Réponse 400 avec message d'erreur | ⬜ |
| T21 | Calcul de remise avec pourcentage > 100 | `curl "http://localhost:3000/remise?prix=100&pourcentage=110"` | Réponse 400 avec message d'erreur | ⬜ |
| T22 | Calcul de remise sans spécifier le prix | `curl "http://localhost:3000/remise?pourcentage=10"` | Réponse 400 avec message d'erreur | ⬜ |
| T23 | Calcul de remise sans spécifier le pourcentage | `curl "http://localhost:3000/remise?prix=100"` | Réponse 400 avec message d'erreur | ⬜ |

### 5. Tests de performance

| ID | Description | Commande curl | Résultat attendu | Statut |
|----|-------------|---------------|-----------------|--------|
| T24 | Mesurer le temps de réponse de l'API | `curl -w "%{time_total}\\n" -o /dev/null -s "http://localhost:3000/convert?from=EUR&to=USD&amount=100"` | Temps de réponse < 1s | ⬜ |
| T25 | Mesurer le temps de réponse sous charge (10 requêtes) | `for i in {1..10}; do curl -s "http://localhost:3000/convert?from=EUR&to=USD&amount=100" > /dev/null; done` | Toutes les requêtes répondent sans erreur | ⬜ |

### 6. Tests de sécurité

| ID | Description | Commande curl | Résultat attendu | Statut |
|----|-------------|---------------|-----------------|--------|
| T26 | Vérifier les en-têtes de sécurité | `curl -I http://localhost:3000` | Présence des en-têtes CORS et autres en-têtes de sécurité | ⬜ |
| T27 | Tentative d'injection SQL | `curl "http://localhost:3000/convert?from=EUR&to=USD&amount=100%27%20OR%20%271%27=%271"` | Réponse 400 avec message d'erreur | ⬜ |
| T28 | Tentative d'injection de script | `curl "http://localhost:3000/convert?from=EUR&to=USD&amount=<script>alert(1)</script>"` | Réponse 400 avec message d'erreur | ⬜ |

## Instructions d'exécution

1. Copiez chaque commande curl dans un terminal
2. Exécutez la commande et vérifiez que le résultat correspond au résultat attendu
3. Marquez le test comme réussi (✅) ou échoué (❌) dans la colonne Statut
4. Pour les tests échoués, notez les détails de l'erreur pour investigation

## Rapport de test

À la fin de l'exécution de tous les tests, complétez le rapport ci-dessous :

- **Date d'exécution** : _____________
- **Nombre de tests exécutés** : 28
- **Nombre de tests réussis** : _____________
- **Nombre de tests échoués** : _____________
- **Taux de réussite** : _____________

### Liste des tests échoués

| ID | Description | Détail de l'erreur |
|----|-------------|-------------------|
|    |             |                   |

### Commentaires et observations

_Ajoutez ici vos commentaires et observations sur les tests_

## Script d'automatisation

Pour exécuter tous les tests automatiquement, vous pouvez utiliser le script bash suivant :

```bash
#!/bin/bash

API_URL="http://localhost:3000"
TOTAL_TESTS=0
PASSED_TESTS=0

run_test() {
  local id=$1
  local description=$2
  local command=$3
  local expected=$4
  
  echo "Exécution du test $id: $description"
  result=$(eval $command)
  
  TOTAL_TESTS=$((TOTAL_TESTS+1))
  
  if [[ "$result" == *"$expected"* ]]; then
    echo "✅ Test réussi"
    PASSED_TESTS=$((PASSED_TESTS+1))
  else
    echo "❌ Test échoué"
    echo "Résultat obtenu: $result"
    echo "Résultat attendu contient: $expected"
  fi
  echo "---------------------------------"
}

# Exemples d'exécution de tests
run_test "T01" "Vérifier que l'API est accessible" "curl -s $API_URL" "API de Conversion"
run_test "T04" "Conversion EUR vers USD" "curl -s \"$API_URL/convert?from=EUR&to=USD&amount=100\"" "result"

# Afficher le rapport final
echo "Tests terminés: $PASSED_TESTS/$TOTAL_TESTS tests réussis ($(( PASSED_TESTS * 100 / TOTAL_TESTS ))%)"
```

---

Document créé le 27/06/2025
