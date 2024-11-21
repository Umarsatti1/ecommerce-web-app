import { Container, Grid } from "@mui/material";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setPageNumber, setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import AppPagination from "../../app/components/AppPagination";
import useProducts from "../../app/hooks/useProducts";
import CheckboxDropdown from "../../app/components/CheckboxButtons";
import SortDropdown from "../../app/components/RadioButtonGroup";

const sortOptions = [
  {value: 'name', label: 'Alphabetical'},
  {value: 'priceDesc', label: 'Price - High to Low'},
  {value: 'price', label: 'Price - Low to High'},
]

export default function Catalog() {
    const {products, brands, types, filtersLoaded, metaData} = useProducts();
    const { productParams } = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

  if (!filtersLoaded) return <LoadingComponent message='Loading products...'/>

    return (
      <Container>
        <Grid container columnSpacing={4}>
          <Grid item xs={3}>
              <ProductSearch />
            <div className="flex justify-end mb-4">
              <SortDropdown 
                options={sortOptions}
                selectedValue={productParams.orderBy}
                onChange={(value) => dispatch(setProductParams({orderBy: value}))}
              />
            </div>

            
              <div className="mb-6">
                <CheckboxDropdown 
                  title="BRANDS"
                  items={brands}
                  checked={productParams.brands}
                  onChange={(items: string[]) => dispatch(setProductParams({ brands: items }))}
                />
              </div>
         
              <div className="mb-6">
                <CheckboxDropdown
                  title="TYPE"
                  items={types}
                  checked={productParams.types}
                  onChange={(items: string[]) => dispatch(setProductParams({ types: items }))}
                />
              </div>
            

          </Grid>
          <Grid item xs={9}>
            <ProductList products={products} />
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={9} sx={{mb: 2}}>
            {metaData &&
            <AppPagination 
              metaData={metaData}
              onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))}
            />}
          </Grid>
        </Grid>
        </Container>
    )
}