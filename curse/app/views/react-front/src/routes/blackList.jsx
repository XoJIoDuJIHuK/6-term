import { useLoaderData } from "react-router-dom";
import { CustomPagination, fetchForLoader, fetchWithResult, getQueryMap } from "../constants";
import { Box, Button, Paper } from "@mui/material";
import { useAlert } from "../components/useAlert";


export async function loader({ request }) {
    const { query } = getQueryMap(request);
    const { list, totalElements } = await fetchForLoader(`/admin/ban`);
    return { list, totalElements, query };
}

export default function BlackList() {
    const showAlert = useAlert();
    const { list, totalElements, query } = useLoaderData();
    return (<Box id='general-wrapper'>
        <Box>{ list.length > 0 ? list.map(e => <Paper key={e.id} sx={{
            padding: '5px',
            wodth: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>{ e.p_subject ? 'Пользователь' : 'Компания' } { e.p_subject ? e.prol_name : e.bour_name }-{'>'} { e.b_subject ? e.prol_name : e.bour_name }
            <Button onClick={() => { fetchWithResult(`/admin/ban?id=${e.id}`, { method: 'DELETE' }, showAlert, () => { location.reload(); }) }}
                >Разблокировать</Button>
        </Paper>) : 'Чёрный список пуст' }</Box>
        {CustomPagination(query, totalElements, (e, value) => {
            query.offset = (value - 1) * 20;
            location.href = `/${location.pathname}?offset=${query.offset}`
        })}
    </Box>);
}