import { ButtonInteraction, EmbedBuilder, Interaction, VoiceChannel } from "discord.js";
import { config } from "../utils/config"
import { appendFile } from '../module/file/appedFile';
import { 
    operationMenu, 
    allowUserPermisson, 
    allowCreateUserPermisson,
    denyUserPermisson, 
} from "../module/voiceCreateData";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const publicChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ボイスチャンネルを公開しました")
    .setDescription("設定を行いたい場合、下のメニューから設定を行ってください\n※ブロック・ブロック解除の操作は行えません")

module.exports = {
	async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isButton()) return;
        const channel = interaction.channel;
        const userName = interaction.user.displayName;
        const userId = interaction.user.id;
        const date = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        // -----------------------------------------------------------------------------------------------------------
        // チャンネルを公開する時の処理
        // -----------------------------------------------------------------------------------------------------------
        if (interaction.customId === "publicButton") {
            try {
                if (channel && channel.type === 2) { // チャンネルがボイスチャンネルかどうか確認
                    const channelName: string = (interaction.channel as VoiceChannel).name;
                    let channelUserLimit: string | number = (interaction.channel as VoiceChannel)?.userLimit;
                    if (channelUserLimit === 0) {
                        channelUserLimit = "無制限";
                    } else {
                        channelUserLimit = `${channelUserLimit} 人`
                    };
                    const channelBitRate = Number((interaction.channel as VoiceChannel)?.bitrate) / 1000;
                    // -----------------------------------------------------------------------------------------------------------
                    // チャンネルの権限をセットする
                    // -----------------------------------------------------------------------------------------------------------
                    await channel.permissionOverwrites.set([
                        {
                            id: interaction.user.id,
                            allow: [allowUserPermisson, allowCreateUserPermisson]
                        },
                        {
                            id: config.authenticatedRoleId,
                            allow: [allowUserPermisson]
                        },
                        {
                            id: config.everyoneRoleId,
                            deny: [denyUserPermisson]
                        }
                    ]);
                    // -----------------------------------------------------------------------------------------------------------
                    // ブロックしているユーザーがいた場合、チャンネルを表示しない
                    // -----------------------------------------------------------------------------------------------------------
                    const allUsers = await prisma.blackLists.findMany({
                        where: {
                            user_id: String(interaction.user.id)
                        },
                    });
                    for (let i = 0; i < allUsers.length; i++) {
                        channel.permissionOverwrites.edit(String(allUsers[i].block_user_id), {
                            ViewChannel: false
                        });
                    };
                    appendFile("logs/vc_create.log", `[${date}] VCを公開しました <実行ユーザー/ID> ${userName}/${userId}\n`);
                    await (interaction as ButtonInteraction).reply({
                        content: "チャンネルを公開しました",
                        ephemeral: true
                    });
                    await interaction.message?.edit({
                        embeds: [
                            publicChannelEmbed.setFields(
                                { name: "現在の設定", value: `チャンネル名: ${channelName}\nユーザー人数制限: ${channelUserLimit}\nビットレート: ${channelBitRate}kbps` },
                            )
                        ],
                        components: [operationMenu]
                    });
                };
            } catch(error) {
                console.log(error);
            };
        };
    }
};