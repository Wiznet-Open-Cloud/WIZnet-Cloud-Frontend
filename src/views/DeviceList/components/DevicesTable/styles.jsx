export default theme => ({
  root: {},
  tableRow: {
    height: "64px"
  },
  tableCell: {
    whiteSpace: "nowrap"
  },
  tableCellInner: {
    display: "flex",
    alignItems: "center"
  },
  avatar: {
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: "#fff",
    display: "inline-flex",
    fontSize: "14px",
    fontWeight: 500,
    height: "36px",
    width: "36px",
    marginLeft: theme.spacing(1) * 1
  },
  nameText: {
    display: "inline-block",
    marginLeft: theme.spacing(1) * 2,
    fontWeight: 500,
    cursor: "pointer"
  },
  button: {
    textTransform: "none"
  }
});
