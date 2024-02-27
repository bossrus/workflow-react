import {createTheme, List, ListItem, ListItemIcon, ListItemText, ThemeProvider, Tooltip} from "@mui/material";
import WifiTetheringTwoToneIcon from "@mui/icons-material/WifiTetheringTwoTone";
import WifiTetheringOffTwoToneIcon from "@mui/icons-material/WifiTetheringOffTwoTone";
import {IUserObject} from "@/interfaces/user.interface.ts";

interface IOnlineIconComponentProps {
    onlineUsers: string[],
    isConnected: boolean,
    users: IUserObject,
    connectToWebsocket: () => void,
}

function OnlineIconComponent(props: IOnlineIconComponentProps) {
    const {onlineUsers, isConnected, users} = props;
    const theme = createTheme({
        components: {
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: 'rgba(213,244,253,0.7)',
                        color: 'black',
                        margin: 0,
                        border: '1px solid blue',
                    },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        minWidth: 20,
                    },
                },
            },
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        color: 'green',
                        fontSize: 15,
                        my: 0,
                    },
                },
            },
            MuiListItemText: {
                styleOverrides: {
                    root: {
                        my: 0,
                        lineHeight: '0.1',
                    },
                    primary: {
                        fontWeight: 'bold',
                    },
                },
            },
            MuiListItem: {
                styleOverrides: {
                    root: {
                        padding: 0
                    },
                },
            },
        },
    });
    return (
        <>
            {
                isConnected ?
                    <ThemeProvider theme={theme}>
                        <Tooltip
                            placement="bottom-end"
                            title={
                                <List>
                                    {onlineUsers.map((item, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <WifiTetheringTwoToneIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary={users && users[item] && users[item].name}/>
                                        </ListItem>
                                    ))}
                                </List>
                            }
                            arrow
                        >
                            <WifiTetheringTwoToneIcon/>
                        </Tooltip>
                    </ThemeProvider>
                    : <WifiTetheringOffTwoToneIcon
                        style={{color: 'red'}}
                        onClick={props.connectToWebsocket}
                    />
            }
        </>
    );
}

export default OnlineIconComponent;
