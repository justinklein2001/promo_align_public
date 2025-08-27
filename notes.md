Logic for storing json string of node:

Could be:
song_nodes_table:
node (json_string)


Schemas:
PromoNodeDataSchema ->
SongNodeSchema ->
node schema -> json_string (whats stored)

save workflow:
save the info to the db, but then you're losing, properties, unless you also make another table for actual nodes and join them on id
    - why would you do it this way? what are the benefits? not much
for rag youre gonna have to parse anyway, its one line my guy.

save is get the data, 
validate it (properly)
apply rag analysis
stringify
save.

Get workflow:
retrieve the json string, parse it, 
