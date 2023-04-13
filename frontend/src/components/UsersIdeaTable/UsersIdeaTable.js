import { TableCell, TableContainer, TableHead, TableRow , Table, TableBody, Paper, Button } from "@mui/material";
import React from "react";

const UsersIdeaTable = ({ likedIdeas = [] }) => {
    return (
        <>
          <h1>Liked Ideas</h1>
          <TableContainer overflow-y="scrollS" component={Paper} id="userProfTable">
              <Table options={{maxBodyHeight:100}}>
                  <TableHead>
                      <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell>Claim</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {likedIdeas.map((idea) => (
                          <TableRow key={idea.idea}>
                              <TableCell>{idea.ideaText}</TableCell>
                              <TableCell>
                                  <Button variant="contained" color="primary">
                                      Claim
                                  </Button>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
        </>
    )
}

export default UsersIdeaTable;
