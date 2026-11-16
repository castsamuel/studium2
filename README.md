# Studium

Plataforma pessoal de estudos para acompanhar rotina, sessões, metas e constância na preparação para o Colégio Naval.

## Executar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Para gerar a versão de produção: `npm run build`; para visualizá-la: `npm run preview`.

## Funcionalidades

- Dashboard com agenda do dia, meta, ofensiva, horas semanais e relógio local.
- Rotina editável, recorrente por dia da semana, com horários, prioridades e exclusão.
- Sessões por disciplina com conteúdo, questões, acertos, notas e cronômetro pausável.
- Calendário mensal, meta diária configurável, dias de descanso e conquistas.
- Estatísticas derivadas dos registros reais, sem dados de demonstração.
- Preferências de perfil, tema, cor, matérias e blocos da sessão.
- Exportação e importação de cópia JSON.

## Dados e privacidade

O Studium usa `localStorage` com chave versionada (`studium.v1`). Isso mantém as informações no navegador e deixa o modelo de dados isolado para uma futura migração a uma API ou banco remoto. Os dados são locais a este navegador e não sincronizam entre dispositivos; use a exportação JSON para cópia de segurança.

## Publicação

O projeto pode ser servido como site estático (por exemplo, GitHub Pages). O Vite usa caminhos relativos para funcionar em subdiretórios. Nenhuma chave, conta ou dado pessoal é incluído no código.

