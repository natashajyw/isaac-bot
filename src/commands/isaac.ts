import { SlashCommandBuilder } from 'discord.js';

export const isaacCommand = new SlashCommandBuilder()
  .setName('isaac')
  .setDescription('Binding of Isaac utilities')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('lookup')
      .setDescription('Look up an item from The Binding of Isaac')
      .addStringOption((option) =>
        option
          .setName('item')
          .setDescription('Item name or ID')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('spindown')
      .setDescription('Show the next 10 items in the spindown dice sequence')
      .addStringOption((option) =>
        option
          .setName('item')
          .setDescription('Current item (name or ID)')
          .setRequired(true)
      )
  );
