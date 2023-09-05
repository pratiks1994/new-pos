export const matchOrderAndTables = (orders, areas) => {
    const ListedTableNo = []; // to list all the tables available in database

    const areasWithOrders = areas?.map(area => {
        const updatedTableWithOrder = area.tables.map(table => {
            ListedTableNo.push(table.table_no);
            const orderOnTable = orders.filter(order => order.order_type === "dine_in" && order.dine_in_table_no === table.table_no);
            return { ...table, orders: orderOnTable };
        });
        return { ...area, tables: updatedTableWithOrder };
    });

    const otherOrders = orders.filter(order => order.order_type === "dine_in" && !ListedTableNo.includes(order.dine_in_table_no));
    const otherTables = otherOrders.map(order => {
        return { id: +order.id, table_no: order.dine_in_table_no.toString(), area_id: areas.length + 1, orders: [order] };
    });

    const otherArea = {
        id: areas.length + 1,
        restaurant_id: 1,
        restaurant_price_id: 4,
        area: "Other Tables",
        tables: otherTables,
    };

    return [...areasWithOrders, otherArea];
};