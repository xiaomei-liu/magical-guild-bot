export const HostCommandSelectEventType = {
    type: 3,
    custom_id: "host_command_1",
    options: [
        {
            label: "Shadow Mission",
            value: "shadow_mission",
            description: "Shadow Mission"
        },
        {
            label: "Dungeon",
            value: "dungeon",
            description: "Dungeon"
        },
    ],
    placeholder: "Please choose a type of mission",
}
const channelsList = [...Array(10).keys()].map(channel => ({
    label: `Channel ${channel + 1}`,
    value: `ch${channel + 1}`,
}))
export const HostCommandSelectEventChannel = {
    type: 3,
    custom_id: "host_command_2",
    options: channelsList,
    placeholder: "Please choose a channel",
}

export const HostCommandSelectTime = {

}