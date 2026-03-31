import scss from './styles/Search.module.scss';
type PropsDefinition = {
    search: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const SearchComponent = ({ search, onChange }: PropsDefinition) => {
    return (
        <div className={scss.searchComponent}>
            <input type='text' name='search' maxLength={50} value={search} autoComplete='search' placeholder='Enter keyword...' onChange={onChange} />
        </div>
    )
}
export default SearchComponent;