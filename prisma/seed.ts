import { hashPassword } from "better-auth/crypto";
import { prisma } from "@/lib/prisma";

type TaskStatus = "TODO" | "DOING" | "DONE" | "ALERT";
type Lane = "TECH" | "GESTAO";

const USERS = [
  {
    name: "Elinéa Libório",
    email: "elinea@einstein.org",
    password: "Einstein@2025",
  },
  {
    name: "Breno dos Santos",
    email: "breno@einstein.org",
    password: "Einstein@2025",
  },
  {
    name: "Alessandre da Silva",
    email: "alessandre@einstein.org",
    password: "Einstein@2025",
  },
  {
    name: "Natasha Porto",
    email: "natasha@einstein.org",
    password: "Einstein@2025",
  },
];

type SeedTask = { text: string; status: TaskStatus; lane: Lane };

const PROJECTS: {
  key: string;
  name: string;
  color: string;
  tasks: SeedTask[];
}[] = [
  {
    key: "malar",
    name: "Malar.IA",
    color: "#e07b39",
    tasks: [
      {
        text: "Revisão do modelo de ML – fase 2",
        status: "DOING",
        lane: "TECH",
      },
      {
        text: "Validação da base de dados Manaus",
        status: "TODO",
        lane: "TECH",
      },
      { text: "Atualização do cronograma", status: "DOING", lane: "GESTAO" },
      { text: "Prestação de contas – abril", status: "ALERT", lane: "GESTAO" },
    ],
  },
  {
    key: "veracis",
    name: "Veracis",
    color: "#3a9e6e",
    tasks: [
      { text: "Integração API diagnóstico", status: "DOING", lane: "TECH" },
      { text: "Testes de homologação", status: "TODO", lane: "TECH" },
      { text: "Reunião com parceiro técnico", status: "DONE", lane: "GESTAO" },
      { text: "Relatório de indicadores", status: "DOING", lane: "GESTAO" },
    ],
  },
  {
    key: "vital",
    name: "Vital Mommy",
    color: "#e88fa8",
    tasks: [
      {
        text: "Desenvolvimento módulo pré-natal",
        status: "DOING",
        lane: "TECH",
      },
      { text: "Revisão UX fluxo gestante", status: "TODO", lane: "TECH" },
      { text: "Alinhamento com DISEI", status: "DOING", lane: "GESTAO" },
      {
        text: "Atualização do plano de trabalho",
        status: "ALERT",
        lane: "GESTAO",
      },
    ],
  },
  {
    key: "trada",
    name: "TRADA",
    color: "#c94040",
    tasks: [
      { text: "Pipeline de dados – versão 1.2", status: "DOING", lane: "TECH" },
      { text: "Documentação técnica", status: "TODO", lane: "TECH" },
      { text: "Reunião com liderança Eneva", status: "DONE", lane: "GESTAO" },
      {
        text: "Proposta fase 2 – revisão final",
        status: "DOING",
        lane: "GESTAO",
      },
    ],
  },
];

async function main() {
  for (const u of USERS) {
    const hashed = await hashPassword(u.password);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        emailVerified: true,
      },
    });

    await prisma.account.upsert({
      where: {
        providerId_accountId: { providerId: "credential", accountId: user.id },
      },
      update: { password: hashed },
      create: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: hashed,
      },
    });

    console.log(`Seeded user ${u.email}`);
  }

  for (const p of PROJECTS) {
    const project = await prisma.project.upsert({
      where: { key: p.key },
      update: { name: p.name, color: p.color },
      create: { key: p.key, name: p.name, color: p.color },
    });

    for (const t of p.tasks) {
      const existing = await prisma.task.findFirst({
        where: { projectId: project.id, text: t.text, lane: t.lane },
      });

      if (!existing) {
        await prisma.task.create({
          data: {
            text: t.text,
            status: t.status,
            lane: t.lane,
            projectId: project.id,
          },
        });
      }
    }

    console.log(`Seeded project ${p.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
