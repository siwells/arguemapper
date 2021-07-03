import { faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Stack, TextField, Toolbar } from "@material-ui/core";
import produce from "immer";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useGraph } from "./GraphContext";

function Inspector() {
  // TODO: `graph` is not shown in debug console
  const { cy, updateGraph } = useGraph();
  // @ts-ignore
  const [element, setElement] = useState(cy.current?.data());

  useEffect(() => {
    if (cy.current) {
      cy.current.on("select", (e) => {
        setElement(e.target.data());
      });
      cy.current.on("unselect", (e) => {
        if (cy.current) {
          // @ts-ignore
          setElement(cy.current.data());
        } else {
          setElement(null);
        }
      });
    }
  }, [cy]);

  const handleChange = useCallback(
    (attr: string | string[]) => {
      // We need to return a function here, thus the nested callbacks
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        cy.current.elements().unselectify();

        setElement((element) => {
          return produce(element, (draft) => {
            _.set(draft, attr, event.target.value);
          });
        });
      };
    },
    [cy]
  );

  let fields = null;

  if (element) {
    if (!element.kind) {
      // edge
    } else if (element.kind === "scheme") {
      // s-node
    } else if (element.kind === "atom") {
      fields = (
        <>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Text"
            value={element.text}
            onChange={handleChange("text")}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Original Text"
            value={element.resource?.text}
            onChange={handleChange(["resource", "text"])}
          />
        </>
      );
    }
  }

  return (
    <>
      <Toolbar>
        <Stack justifyContent="space-around" direction="row" sx={{ width: 1 }}>
          <Button
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faSave} />}
            onClick={() => {
              if (element) {
                const cytoElem = cy.current.$id(element.id);
                cytoElem.data(element);
                updateGraph();
              }
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<FontAwesomeIcon icon={faBan} />}
            onClick={() => {
              cy.current.elements().selectify();
              cy.current.elements().unselect();
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Toolbar>
      <Stack spacing={3} sx={{ padding: 3 }}>
        {fields}
      </Stack>
    </>
  );
}

export default Inspector;
