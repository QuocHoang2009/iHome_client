import { Dialog, DialogTitle } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from "react-redux";

const ButtonsDialog = (props) =>{
    const nodes = useSelector((state)=> state.nodes);
    const buttonNodes = nodes.filter(node=> node.type === "Button");
    const { onClose, selectedValue, open } = props;

    const buttons = buttonNodes.map((buttonNode)=>{
        let channels = [];

        for(let i = 0; i < buttonNode.numChannel; i++){
            channels[i] = {channel: i + 1}
        }

        const button = channels.map((channel)=> {
            return  {...channel, ...buttonNode};
        });

        return button;
    })
    
    let buttonChannels =[];
    for(let i = 0; i < buttons.length; i++){
        buttonChannels = buttonChannels.concat(buttons[i]);
    }

    const handleListItemClick = (value) => {
        onClose(value);
    };

    const handleClose = () => {
      onClose(selectedValue);
    };

    const CheckChannel = (channel, key)=>{
        channel = channel.channel;

        return(
            <ListItem disableGutters  key={key} >
                <ListItemButton onClick={() => handleListItemClick(channel)}>
                    <ListItemText primary={channel?.name + " channel " + channel?.channel} />
                </ListItemButton>
            </ListItem>
        )
    }
    
    return(
        <Dialog onClose={()=>handleClose()} open={open} >
            <DialogTitle minWidth="200px">SELECT RELAY CHANNEL</DialogTitle>
            <List sx={{ pt: 0 }} >
                {buttonChannels.map((button, index) => 
                    <CheckChannel channel={button} key={index}/>
                )}
                <ListItemButton onClick={() => handleListItemClick()}>
                    <ListItemText primary={"Cancel"} />
                </ListItemButton>
            </List>
        </Dialog> 
    )
}

export default ButtonsDialog;