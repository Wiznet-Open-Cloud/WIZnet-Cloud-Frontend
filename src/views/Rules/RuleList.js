import React, { useState, useEffect } from "react";

import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button
} from "@material-ui/core";

import { firestore } from "platform/Firebase/Firebase";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 10
  },
  table: {
    minWidth: 500
  }
}));

const headers = ["displayName", "channel", "condition", "threshold"];

const RuleList = props => {
  const classes = useStyles();

  const [ruleList, setRuleList] = useState([]);
  const { dataSource } = props;

  useEffect(() => {
    const updateRuleList = () => {
      try {
        firestore
          .collection("dataSource")
          .doc(dataSource)
          .onSnapshot(doc => {
            console.log("updateRuleList()", doc.data());
            var rules = doc.data().rules;
            setRuleList(rules);
            console.log("<RuleList>", rules);
          });
      } catch (err) {
        console.log("<RuleList> error:", err);
      }
    };

    updateRuleList();
  }, [dataSource]);

  const handleDelete = async index => {
    var retVal = window.confirm("Are you sure to delete this rule?");

    if (retVal) {
      try {
        const docSnapshot = await firestore
          .collection("dataSource")
          .doc(dataSource)
          .get();

        var rules = docSnapshot.data().rules;
        var newRules = rules.slice();
        newRules.splice(index, 1);

        firestore
          .collection("dataSource")
          .doc(dataSource)
          .set({ rules: newRules }, { merge: true })
          .then(doc => {
            alert("The rule removed.");
          })
          .catch(error => {
            console.log("error =>", error);
          });
      } catch (err) {
        console.log("handleDelete()", err);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Card style={{ padding: 20, width: "100%" }}>
        <h3>Defined Rule List</h3>
        {ruleList.length > 0 ? (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
                <TableCell>{"event type"}</TableCell>
                <TableCell>{"target source"}</TableCell>
                <TableCell>{"data"}</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ruleList.map((rule, index) => (
                <TableRow key={index}>
                  {headers.map((header, index) => (
                    <TableCell key={index}>
                      <Typography variant="subtitle1">
                        {rule[header]}
                      </Typography>
                    </TableCell>
                  ))}
                  <TableCell>
                    <Typography variant="subtitle1">
                      {rule.event.eventType}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {rule.event.targetSourceId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {rule.event.context.config.binaryData}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDelete(index)}
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          "There is no defined rule."
        )}
      </Card>
    </div>
  );
};

export default RuleList;
