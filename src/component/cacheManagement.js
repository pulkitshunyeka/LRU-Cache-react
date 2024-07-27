import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useGetCacheQuery, useSetCacheMutation } from "../services/apiSlice";
import "./cacheManagement.css";

export default function CacheManager() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [duration, setDuration] = useState("");
  const [setCache, { isLoading: isSettingCache, error: setCacheError }] =
    useSetCacheMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState("");
  const [dialogValue, setDialogValue] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSetKey, setIsSetKey] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0); // Added state for count
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const {
    data: cacheData,
    isLoading: isFetchingCache,
    error: fetchCacheError,
  } = useGetCacheQuery(isSetKey, { skip: isSetKey === "" });

  function establishConnection() {
    let socket = new WebSocket("ws://localhost:8080/ws");
    socket.onopen = function (event) {
      return socket;
    };
    return socket;
  }

  useEffect(() => {
    let socket = establishConnection();
    console.log("Socket is ", socket);
    if (socket) {
      console.log("inside if");
      socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("data is ", data);
        setNotifications((prev) => [...prev, data]);
        setNotificationCount((prev) => prev + 1); // Increment count
        setSnackbarMessage(`New key set: ${data.key}`);
        setSnackbarOpen(true);
      };
    }
    return () => {
      socket.close();
    };
  }, []);

  async function getKeyValue(key) {
    setIsSetKey(key);
    if (cacheData) {
      setDialogKey(cacheData.key);
      setDialogValue(cacheData.value);
      setDialogOpen(true);
    } else {
      setDialogKey("No key found");
    }
  }

  const handleSet = async () => {
    const durationInt = parseInt(duration, 10);
    if (isNaN(durationInt)) {
      console.error("Invalid duration value");
      return;
    }
    try {
      await setCache({ key, value, duration: durationInt }).unwrap();
      setValue("");
      setDuration("");
      setSnackbarMessage("Cache set successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to set cache", error);
      setSnackbarMessage("Failed to set cache.");
      setSnackbarOpen(true);
    }
  };

  const handleGetKeyValue = async () => {
    if (key) {
      try {
        getKeyValue(key);
      } catch (error) {
        console.error("Failed to fetch cache data", error);
        setDialogKey("Error");
        setDialogValue("Failed to fetch data");
        setDialogOpen(true);
      }
    } else {
      setSnackbarMessage("No key set.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setNotificationCount(0); // Reset count when menu is opened
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    handleMenuClose();
  };

  return (
    <div className="cache-manager-container">
      <Paper elevation={3} className="cache-manager-form">
        <Typography variant="h4" gutterBottom>
          Cache Manager
        </Typography>

        <div style={{ marginBottom: 20 }}>
          <TextField
            fullWidth
            label="Key"
            variant="outlined"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Value"
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Duration (seconds)"
            type="number"
            variant="outlined"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            margin="normal"
          />
        </div>

        <div className="button-container">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSet}
            disabled={isSettingCache}
            style={{ marginBottom: 20 }}
          >
            {isSettingCache ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Set Cache"
            )}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGetKeyValue}
            style={{ marginBottom: 20 }}
          >
            Get Key Value
          </Button>

          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            style={{ marginLeft: 20 }}
          >
            <Badge
              badgeContent={notificationCount} // Use the notification count state
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </div>

        {fetchCacheError && (
          <Alert severity="error" style={{ marginBottom: 20 }}>
            Failed to fetch cache data: {fetchCacheError}
          </Alert>
        )}

        {isFetchingCache && <CircularProgress />}

        {setCacheError && (
          <Alert severity="error" style={{ marginTop: 20 }}>
            Failed to set cache: {setCacheError.message}
          </Alert>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <Button color="inherit" onClick={handleCloseSnackbar}>
              Close
            </Button>
          }
        />

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="key-value-dialog-title"
          aria-describedby="key-value-dialog-description"
        >
          <DialogTitle id="key-value-dialog-title">Key-Value Pair</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>Key:</strong> {dialogKey}
            </Typography>
            <Typography variant="body1">
              <strong>Value:</strong> {dialogValue}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          {notifications.length === 0 ? (
            <MenuItem>No notifications</MenuItem>
          ) : (
            notifications.map((notification, index) => (
              <MenuItem key={index} onClick={handleClearNotifications}>
                {`New key set: ${notification.key}`}
              </MenuItem>
            ))
          )}
        </Menu>
      </Paper>
    </div>
  );
}
