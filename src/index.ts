import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { isaacCommand } from './commands/isaac.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('Missing DISCORD_TOKEN in environment');
  process.exit(1);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'isaac') {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'lookup') {
      const item = interaction.options.getString('item', true);
      // TODO: Implement lookup logic
      await interaction.reply(`Lookup: ${item}`);
    } else if (subcommand === 'spindown') {
      const item = interaction.options.getString('item', true);
      // TODO: Implement spindown logic
      await interaction.reply(`Spindown: ${item}`);
    }
  }
});

async function registerCommands() {
  const rest = new REST().setToken(token!);
  const commands = [isaacCommand.toJSON()];

  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    console.error('Missing DISCORD_CLIENT_ID in environment');
    process.exit(1);
  }

  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('Slash commands registered');
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
}

async function main() {
  await registerCommands();
  await client.login(token);
}

main();
