export default theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "63px",
    flexShrink: 0,
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  logoLink: {
    fontSize: 0
  },
  logoImage: {
    cursor: "pointer"
  },
  logoDivider: {
    marginBottom: theme.spacing(1) * 2
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "fit-content",
    justifyContent: "center"
  },
  progressWrapper: {
    paddingTop: "48px",
    paddingBottom: "24px",
    display: "flex",
    justifyContent: "center"
  },
  avatar: {
    width: "60px",
    height: "60px",
    color: "#fff",
    backgroundColor: "#673ab7"
  },
  nameText: {
    marginTop: theme.spacing(1) * 2
  },
  bioText: {},
  profileDivider: {
    marginBottom: theme.spacing(1) * 2,
    marginTop: theme.spacing(1) * 2
  },
  listSubheader: {
    color: theme.palette.text.secondary
  },
  listItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      borderRadius: "4px",
      "& $listItemIcon": {
        color: theme.palette.primary.main,
        marginLeft: "-4px"
      }
    },
    "& + &": {
      marginTop: theme.spacing(1)
    }
  },
  activeListItem: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    borderRadius: "4px",
    backgroundColor: theme.palette.primary.light,
    "& $listItemText": {
      color: theme.palette.text.primary
    },
    "& $listItemIcon": {
      color: theme.palette.primary.main,
      marginLeft: "-4px"
    }
  },
  listItemIcon: {
    marginRight: 0
  },
  listItemText: {
    fontWeight: 500,
    color: theme.palette.text.secondary
  },
  listDivider: {
    marginBottom: theme.spacing(1) * 2,
    marginTop: theme.spacing(1) * 2
  }
});
