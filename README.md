# RPG System

Sistema web para RPG de mesa com foco em suporte ao mestre, interação em mapa e ficha de personagem, inspirado em campanhas de terror psicológico e sobrevivência.

---

# Premissa

“Um grupo de pessoas fica preso após um evento inexplicável e passa a ser caçado enquanto tenta sobreviver.

O medo não pode ser resolvido com poder.
Fugir é melhor que lutar.
Se esconder é melhor que enfrentar.”

Após uma luz intensa e um possível pulso eletromagnético, várias pessoas desconhecidas acabam se encontrando em uma estrada isolada.

Ninguém confia em ninguém.

Ao mesmo tempo em que tentam entender o que aconteceu, percebem que todos sentiram a mesma coisa… e que algo dentro deles mudou.

---

# Conceito Narrativo

O sistema possui foco em:

* Terror psicológico
* Sobrevivência
* Tensão entre jogadores
* Escolhas morais
* Narrativa emergente
* Poderes com consequências

O objetivo não é derrotar monstros.

É sobreviver.

Mesmo que alguém precise ficar para trás.

---

# Principais Ameaças

## 👹 A criatura / assassino

Uma presença constante que força movimento, medo e desespero.

---

## 👩‍🔬 Cientista / governo

Uma organização ligada a experimentos ilegais envolvendo humanos.

Os personagens não foram afetados por acidente.

Eles foram escolhidos.

---

## 🧠 Os próprios poderes

As habilidades ajudam os personagens…

Mas também os destroem aos poucos.

Quanto mais usam:
* mais instáveis ficam
* mais perdem sanidade
* mais perto chegam de “virar algo pior”

---

# Sistema de Sanidade

Uso de poderes afeta diretamente a SAN (sanidade).

Consequências:
* paranoia
* perda de controle
* distorções da realidade
* comportamento agressivo
* conflitos internos

O sistema incentiva:
* egoísmo
* desconfiança
* decisões difíceis
* tensão entre players

---

# Personagens

Os personagens da campanha possuem segredos próprios, habilidades únicas e conflitos internos.

As informações completas dos personagens não ficam públicas no sistema.

Cada jogador conhece apenas:
* sua própria ficha
* parte da personalidade dos outros personagens
* o que foi revelado durante a narrativa

---

# Tecnologias Utilizadas

## Frontend

* React
* JavaScript
* CSS Modules
* Socket.IO Client

---

## Backend

* Node.js
* Express
* Socket.IO

---

# Estrutura Atual do Projeto

rpg-system/
│
├── backend/
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── socket.js
│       │
│       └── components/
│           │
│           ├── Map/
│           │   ├── Map.js
│           │   └── Map.module.css
│           │
│           ├── Lobby/
│           │   ├── Lobby.js
│           │   └── Lobby.module.css
│           │
│           ├── Layout/
│           │   ├── GameLayout.js
│           │   └── GameLayout.module.css
│           │
│           └── panels/
│               ├── MasterPanel.js
│               ├── MasterPanel.module.css
│               ├── PlayerPanel.js
│               └── PlayerPanel.module.css

---

# Funcionalidades Atuais

## Sistema de Login

* Login via backend
* Controle de permissões
* Separação entre:
  * mestre
  * players

---

## Lobby

* Entrada inicial dos jogadores
* Preparação antes da sessão
* Base para sistema de sala multiplayer

---

## Sistema Multiplayer em Tempo Real

Utilizando WebSockets com Socket.IO:
* movimentação sincronizada
* atualização em tempo real
* eventos privados
* comunicação mestre ↔ jogadores

---

## Mapa Grid

* Grid visual
* Movimento em tempo real
* Renderização de:
  * jogadores
  * NPCs
* Sistema de zoom
* Base pronta para:
  * colisão
  * visão
  * eventos
  * interações

---

## Sistema de Movimento

Players:
* movimentação por direção
* sincronização em tempo real

Mestre:
* controle livre do ambiente

---

## NPCs

O mestre pode:
* spawnar NPCs
* mover NPCs manualmente
* controlar eventos envolvendo NPCs

---

## Painel do Mestre

Controle atual:
* modos do jogo
* STOP global
* spawn de NPC
* movimentação de NPC
* eventos privados
* narrativa

---

## Painel do Jogador

Cada jogador possui:
* informações do personagem
* movimentação
* integração futura com:
  * inventário
  * status
  * sanidade
  * poderes

---

# Estrutura de Dados

## Users

Responsável por:
* login
* permissões
* personagem associado

---

## Players

Estado em tempo real:
* posição
* socket
* status
* dados dinâmicos

---

## NPCs

Entidades controladas pelo mestre:
* posição
* comportamento
* eventos

---

# Conceitos Importantes

## role

Define permissões:
* mestre
* player

---

## character

Define:
* ficha
* atributos
* habilidades
* identidade narrativa

---

## player

Representa:
* conexão
* estado em tempo real
* posição no mapa

---

# Objetivo do Projeto

Criar uma ferramenta leve e imersiva para RPG online focada em:

* terror psicológico
* narrativa dinâmica
* suporte ao mestre
* tensão entre jogadores
* sobrevivência
* multiplayer em tempo real

---

# Próximos Passos

## Sistema de Dados

* rolagem de dados
* testes automáticos
* vantagem/desvantagem

---

## Sistema de Sanidade

* efeitos mentais
* perda de controle
* eventos psicológicos
* alterações narrativas

---

## Inventário

* itens utilizáveis
* peso
* loot
* inspeção

---

## Sistema de Eventos

* cenas do mestre
* triggers no mapa
* eventos privados
* sustos e perseguições

---

## Interface

* visual mais imersivo
* HUD estilizada
* animações
* efeitos de tensão

---

## Gameplay

* sistema de visão
* iluminação
* colisão
* perseguições
* IA básica para criatura

---

# Status

🚧 Em desenvolvimento ativo (bugs alert)

Projeto evoluindo junto da campanha e da construção narrativa.

```
Autor
Desenvolvido por Vitor Hugo Piske Trapp

 /\_/\  
( o.o ) 
 > ^ <
```
