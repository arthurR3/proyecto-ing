import { useContext } from "react";
import { FiltersContext } from "./Context/FiltersContext";

export function useFilter() {
    const { filters, setFilters } = useContext(FiltersContext);

    const filterProducts = (products) => {
        return products.filter((product) => {
            return (
                product.name === filters.name && (
                    product.categoria === filters.category ||
                    product.marca === filters.brand

                )
            )
        })
    }
    
    return {filters, filterProducts, setFilters}
}

