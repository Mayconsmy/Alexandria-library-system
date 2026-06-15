# Backlog do Produto — Alexandria Library System
> Sistema de Clubes de Leitura | Atualizado em: Junho/2026

---

## Legenda

| Símbolo | Significado |
|---|---|
| ✅ | Implementado |
| 🔶 | Parcialmente implementado |
| ❌ | Não implementado |

| Prioridade | Descrição |
|---|---|
| 🔴 Alta | Funcionalidade essencial para o MVP — bloqueia outras entregas |
| 🟡 Média | Importante para a experiência do usuário, mas não bloqueia o MVP |
| 🟢 Baixa | Desejável, entregue após as funcionalidades principais |

---

## 1 — Autenticação e Perfil de Usuário

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-01 | Como **visitante**, quero me cadastrar na plataforma informando nome, e-mail e senha, para criar minha conta e acessar o sistema. | 🔴 Alta | ✅ Implementado | Conta criada com e-mail único; erro exibido se e-mail duplicado ou campos inválidos. |
| RF-02 | Como **usuário cadastrado**, quero fazer login com e-mail e senha, para acessar minha conta com segurança. | 🔴 Alta | ✅ Implementado | JWT retornado após login válido; mensagem de erro para credenciais incorretas. |
| RF-03 | Como **usuário**, quero editar meu perfil (nome, foto e preferências de leitura), para personalizar minha identidade na plataforma. | 🟡 Média | ✅ Implementado | Alterações salvas e refletidas imediatamente no perfil. |
| RF-04 | Como **usuário**, quero escolher meu tipo de perfil (leitor, autor), para que o sistema adeque as funcionalidades ao meu uso. | 🟡 Média | 🔶 Parcialmente implementado | Campo `tipo_perfil` existe no banco e na entidade; diferenciação de permissões por tipo ainda não aplicada nas rotas. |
| RF-05 | Como **usuário**, quero recuperar minha senha por e-mail, para não perder o acesso à conta. | 🟡 Média | ❌ Não implementado | Link de redefinição enviado por e-mail; senha alterada com sucesso. |
| RF-06 | Como **usuário**, quero fazer login com minha conta Google, para acessar a plataforma sem precisar criar uma senha separada. | 🟢 Baixa | ❌ Não implementado | Autenticação OAuth2 funcional com redirecionamento e criação/vinculação de conta. |

---

## 2 — Biblioteca Digital

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-07 | Como **usuário**, quero visualizar o catálogo de livros disponíveis na plataforma, para descobrir novas obras. | 🔴 Alta | ✅ Implementado | Lista de livros exibida com título, autor, gênero e capa; paginação funcional. |
| RF-08 | Como **usuário**, quero pesquisar livros por título, autor ou gênero, para encontrar rapidamente o que procuro. | 🔴 Alta | ✅ Implementado | Resultados filtrados corretamente; mensagem "nenhum resultado" quando não há correspondência. |
| RF-09 | Como **usuário**, quero ver os detalhes de um livro (sinopse, avaliação média, resenhas), para decidir se quero lê-lo. | 🔴 Alta | ✅ Implementado | Página de detalhes exibe todas as informações e lista de resenhas. |
| RF-10 | Como **usuário**, quero diferenciar tipos de conteúdo (livro, mangá, HQ), para organizar melhor minha biblioteca. | 🟡 Média | 🔶 Parcialmente implementado | Campo `tipo` existe no modelo e no banco; filtro por tipo ainda não exposto no frontend. |
| RF-11 | Como **usuário**, quero acessar livros em formato de audiobook, para ler mesmo quando não posso usar os olhos. | 🟢 Baixa | ❌ Não implementado | Player de áudio funcional na página do livro. |

---

## 3 — Registro e Progresso de Leitura

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-12 | Como **usuário**, quero adicionar um livro à minha lista "quero ler", para não esquecer os títulos que me interessam. | 🔴 Alta | ✅ Implementado | Livro adicionado e visível na aba "Quero ler" do perfil; botão de remoção funciona. |
| RF-13 | Como **usuário**, quero marcar um livro como "lendo" e registrar meu progresso (páginas ou percentual), para acompanhar minha leitura atual. | 🔴 Alta | ✅ Implementado | Progresso salvo e exibido corretamente; não permite valor acima de 100%. |
| RF-14 | Como **usuário**, quero marcar um livro como "lido" e registrar a data de conclusão, para manter meu histórico de leituras. | 🔴 Alta | ✅ Implementado | Status atualizado para "lido"; data de conclusão registrada; estatísticas incrementadas. |
| RF-15 | Como **usuário**, quero contabilizar uma releitura como nova leitura, para que meu histórico reflita leituras repetidas de um mesmo livro. | 🟢 Baixa | ❌ Não implementado | Sistema permite novo registro de leitura para livro já marcado como "lido" e incrementa contador. |
| RF-16 | Como **usuário**, quero reagir a trechos específicos de um livro, para registrar momentos marcantes durante a leitura. | 🟢 Baixa | ❌ Não implementado | Trecho marcado com reação salva e visível no perfil. |

---

## 4 — Resenhas e Interações Sociais

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-17 | Como **usuário**, quero publicar uma resenha de um livro com texto e nota (0 a 5), para compartilhar minha opinião com outros leitores. | 🔴 Alta | ✅ Implementado | Resenha publicada e visível na página do livro; nota reflete na média geral. |
| RF-18 | Como **usuário**, quero editar ou excluir minhas próprias resenhas, para corrigir ou remover conteúdo que publiquei. | 🟡 Média | ✅ Implementado | Edição e exclusão disponíveis apenas para o autor; outras resenhas não são afetadas. |
| RF-19 | Como **usuário**, quero curtir ou reagir à resenha de outro leitor, para demonstrar que achei o conteúdo útil ou interessante. | 🔴 Alta | 🔶 Parcialmente implementado | Entidade `Reacao` e endpoint existem no backend; botão de reação ainda não integrado no frontend. |
| RF-20 | Como **usuário**, quero comentar em uma resenha, para interagir diretamente com outros leitores sobre um livro. | 🔴 Alta | ❌ Não implementado | Comentário publicado e visível abaixo da resenha; autor pode excluir próprios comentários. |
| RF-21 | Como **usuário**, quero compartilhar um livro ou resenha nas redes sociais, para recomendar leituras para meus contatos externos. | 🟡 Média | ❌ Não implementado | Link de compartilhamento gerado com preview adequado (Open Graph). |
| RF-22 | Como **usuário**, quero publicar Stories (publicações temporárias), para compartilhar momentos de leitura que expiram após 24h. | 🟢 Baixa | ❌ Não implementado | Conteúdo expira automaticamente; visível para seguidores enquanto ativo. |

---

## 5 — Grupos de Leitura

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-23 | Como **usuário**, quero criar um grupo de leitura com nome, descrição e configuração de privacidade (público/privado), para reunir leitores com interesses comuns. | 🔴 Alta | ✅ Implementado | Grupo criado; criador definido como administrador; aparece na listagem pública se público. |
| RF-24 | Como **usuário**, quero entrar em um grupo de leitura público diretamente, para participar sem precisar de aprovação. | 🔴 Alta | ✅ Implementado | Usuário adicionado ao grupo; erro exibido se já for membro. |
| RF-25 | Como **usuário**, quero solicitar entrada em um grupo privado e aguardar aprovação do administrador, para respeitar as regras de acesso do grupo. | 🟡 Média | 🔶 Parcialmente implementado | Endpoint de solicitação existe; fluxo de aprovação pelo administrador ainda não implementado. |
| RF-26 | Como **administrador de grupo**, quero remover membros do grupo, para manter o ambiente adequado às regras da comunidade. | 🟡 Média | ✅ Implementado | Membro removido pelo endpoint `DELETE /api/grupos/{id}/membros/{usuarioId}`; apenas admin pode executar. |
| RF-27 | Como **usuário**, quero participar de uma leitura compartilhada em grupo (todos lendo o mesmo livro ao mesmo tempo), para sincronizar o progresso com os demais membros. | 🟡 Média | ❌ Não implementado | Sessão de leitura criada no grupo; progresso dos membros visível em tempo real. |

---

## 6 — Chat em Grupo

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-28 | Como **membro de um grupo**, quero enviar mensagens no chat do grupo, para interagir com os outros participantes. | 🔴 Alta | ✅ Implementado | Mensagem enviada e exibida no chat do grupo com nome do remetente e hora. |
| RF-29 | Como **membro de um grupo**, quero ver o histórico de mensagens do chat, para acompanhar conversas anteriores. | 🔴 Alta | ✅ Implementado | Histórico carregado ao acessar o grupo; mensagens em ordem cronológica. |
| RF-30 | Como **membro de um grupo**, quero receber as novas mensagens automaticamente sem precisar recarregar a página, para ter uma experiência de chat em tempo real. | 🟡 Média | 🔶 Parcialmente implementado | Frontend realiza polling a cada 5 segundos; WebSocket não implementado. |

---

## 7 — Metas de Leitura

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-31 | Como **usuário**, quero criar uma meta de leitura (ex: 12 livros em 2026) com prazo definido, para me comprometer com objetivos de leitura. | 🔴 Alta | ✅ Implementado | Meta salva com quantidade, prazo e progresso zerado; exibida na tela de metas. |
| RF-32 | Como **usuário**, quero que meu progresso nas metas seja atualizado automaticamente quando marco um livro como "lido", para não precisar atualizar manualmente. | 🔴 Alta | ✅ Implementado | Ao marcar livro como "lido", progresso da meta ativa é incrementado automaticamente. |
| RF-33 | Como **usuário**, quero visualizar o progresso de cada meta com barra de percentual, para saber rapidamente como estou em relação ao meu objetivo. | 🟡 Média | ✅ Implementado | Barra de progresso exibe percentual correto; cor muda conforme aproximação do prazo. |
| RF-34 | Como **usuário**, quero ter múltiplas metas ativas ao mesmo tempo, para acompanhar objetivos de diferentes tipos simultaneamente. | 🟡 Média | ✅ Implementado | Sistema permite criar várias metas; todas são listadas e acompanhadas individualmente. |

---

## 8 — Estatísticas e Gamificação

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-35 | Como **usuário**, quero ver um painel com minha estatística de leitura (livros lidos, lendo e desejados), para entender meu comportamento como leitor. | 🟡 Média | ✅ Implementado | Dashboard exibe os três contadores atualizados em tempo real conforme as ações do usuário. |
| RF-36 | Como **usuário**, quero acumular pontos ao registrar leituras, publicar resenhas e participar de grupos, para ser recompensado pelo meu engajamento. | 🟡 Média | 🔶 Parcialmente implementado | Campo de pontos existe no modelo; lógica de acúmulo automático por ações ainda não implementada. |
| RF-37 | Como **usuário**, quero ver meu nível e conquistas no perfil, para sentir a progressão e motivação contínua. | 🟡 Média | ❌ Não implementado | Nível e distintivos exibidos no perfil com critérios claros de desbloqueio. |
| RF-38 | Como **usuário**, quero ver um ranking dos leitores mais ativos da plataforma, para ter uma referência de engajamento. | 🟢 Baixa | ❌ Não implementado | Ranking exibido com os top 10 usuários por pontos; atualizado semanalmente. |

---

## 9 — Notificações

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-39 | Como **usuário**, quero receber notificações sobre atividades relevantes (nova mensagem no grupo, reação à minha resenha, convite para grupo), para me manter informado sem precisar verificar tudo manualmente. | 🟡 Média | ✅ Implementado | Notificações criadas automaticamente pelo sistema; listadas no ícone de sino. |
| RF-40 | Como **usuário**, quero marcar notificações como lidas, para controlar o que já vi. | 🟡 Média | ✅ Implementado | Endpoint `PUT /api/notificacoes/{id}/ler` funcional; contador de não lidas atualizado. |
| RF-41 | Como **usuário**, quero configurar quais tipos de notificação desejo receber, para não ser incomodado com alertas irrelevantes. | 🟡 Média | ❌ Não implementado | Painel de preferências de notificação no perfil com toggles por categoria. |

---

## 10 — Recomendações

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-42 | Como **usuário**, quero receber sugestões de livros com base no meu histórico e preferências de gênero, para descobrir novas leituras alinhadas ao meu gosto. | 🟡 Média | ❌ Não implementado | Seção "Recomendados para você" exibida no dashboard com ao menos 3 sugestões relevantes. |
| RF-43 | Como **usuário**, quero que o sistema sugira grupos de leitura compatíveis com meus interesses, para encontrar comunidades relevantes sem precisar pesquisar. | 🟢 Baixa | ❌ Não implementado | Sugestão de grupos exibida na tela de grupos com base em gêneros favoritos do usuário. |

---

## 11 — Acessibilidade e Experiência

| ID | Requisito Funcional | Prioridade | Status | Critério de Aceite |
|---|---|---|---|---|
| RF-44 | Como **usuário**, quero alternar entre tema claro e escuro na interface, para adaptar o visual ao meu ambiente ou preferência. | 🟡 Média | ✅ Implementado | Alternância de tema funciona; preferência salva no localStorage. |
| RF-45 | Como **usuário**, quero usar a plataforma em dispositivos móveis com boa experiência, para não depender exclusivamente de um computador. | 🟡 Média | ✅ Implementado | Interface responsiva; todos os fluxos principais funcionais em telas a partir de 375px. |
| RF-46 | Como **usuário**, quero acessar parte do conteúdo salvo sem conexão à internet, para continuar usando a plataforma em situações de conectividade limitada. | 🟢 Baixa | ❌ Não implementado | Conteúdo previamente carregado acessível offline via Service Worker. |

---

## Resumo Geral do Backlog

| Status | Quantidade | % do Total |
|---|---|---|
| ✅ Implementado | 24 | 52% |
| 🔶 Parcialmente implementado | 7 | 15% |
| ❌ Não implementado | 15 | 33% |
| **Total** | **46** | **100%** |

### Por Prioridade

| Prioridade | Total | ✅ | 🔶 | ❌ |
|---|---|---|---|---|
| 🔴 Alta | 18 | 15 | 2 | 1 |
| 🟡 Média | 20 | 8 | 4 | 8 |
| 🟢 Baixa | 8 | 0 | 0 | 8 |

---

## Itens Pendentes de Alta Prioridade

Os seguintes itens de alta prioridade ainda precisam de atenção:

- **RF-20** — Comentários em resenhas (não implementado)
- **RF-19** — Integração do frontend para reações em resenhas (parcial)

---

## Próximas Entregas Sugeridas (Sprint Backlog)

Com base na priorização e no estado atual, os itens recomendados para as próximas sprints são:

**Sprint atual — fechar itens de alta prioridade:**
- RF-19: Integrar botão de reação no frontend
- RF-20: Implementar comentários em resenhas

**Próxima sprint — média prioridade:**
- RF-25: Fluxo de aprovação para grupos privados
- RF-36: Lógica de acúmulo de pontos por ações
- RF-41: Preferências de notificação
- RF-42: Recomendações de livros por gênero favorito

**Backlog futuro — baixa prioridade / pós-MVP:**
- RF-05: Recuperação de senha por e-mail
- RF-06: Login com Google (OAuth2)
- RF-27: Leitura compartilhada em tempo real
- RF-37: Níveis e conquistas
- RF-38: Ranking de leitores
- RF-46: Modo offline (Service Worker)

---

*Documento elaborado com base nos requisitos funcionais RF01–RF20 do relatório EG-12-46 e no estado atual do repositório Alexandria-library-system.*