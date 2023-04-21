import { Dialog, DialogTitle } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRelayNodes } from "../app/state";
import { getAllRelays } from "../const/API";

const RelaysDialog = (props) => {
  const relayNodes = useSelector((state) => state.relayNodes);
  const currentHome = useSelector((state) => state.currentHome);
  const dispatch = useDispatch();
  const { onClose, selectedValue, open } = props;

  useEffect(() => {
    (async () => {
      const api = getAllRelays + currentHome.home;
      const res = await axios.get(api);
      if (res.data) {
        dispatch(setRelayNodes({ relayNodes: res.data }));
      }
    })();
  }, [currentHome, dispatch, open]);

  const relays = relayNodes.map((relayNode) => {
    const channels = relayNode.channels.map((relayChannel) => {
      return relayChannel;
    });

    const relay = channels.map((channel) => {
      return { ...channel, ...relayNode };
    });

    return relay;
  });

  let relayChannels = [];
  for (let i = 0; i < relays.length; i++) {
    relayChannels = relayChannels.concat(relays[i]);
  }

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const handleClose = () => {
    onClose(selectedValue);
  };

  const CheckChannel = (channel, key) => {
    channel = channel.channel;
    if (channel?.link) return;

    return (
      <ListItem disableGutters key={key}>
        <ListItemButton onClick={() => handleListItemClick(channel)}>
          <ListItemText
            primary={channel?.name + " channel " + channel?.channel}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Dialog onClose={() => handleClose()} open={open}>
      <DialogTitle minWidth="200px">SELECT RELAY CHANNEL</DialogTitle>
      <List sx={{ pt: 0 }}>
        {relayChannels.map((relay, index) => (
          <CheckChannel channel={relay} key={index} />
        ))}
        <ListItemButton onClick={() => handleListItemClick()}>
          <ListItemText primary={"Cancel"} />
        </ListItemButton>
      </List>
    </Dialog>
  );
};

export default RelaysDialog;
