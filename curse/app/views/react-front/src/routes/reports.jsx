import { useLoaderData } from "react-router-dom";
import { CustomPagination, fetchForLoader, fetchWithResult, getQueryMap } from "../constants";
import { Box, Paper, Button } from "@mui/material";
import { useAlert } from "../components/useAlert";


export async function loader({ request }) {
    const query = getQueryMap(request);
    const { reports, totalElements } = await fetchForLoader(`/admin/reported-reviews`);
    console.log(reports)
    return { reports, query, totalElements };
}

export default function Reports() {
    const showAlert = useAlert();
    const { reports, query, totalElements } = useLoaderData();
    return (<Box id='general-wrapper'>
        <Box>{ reports.length > 0 ? reports.map(r => <Paper elevation={3} key={r.id} sx={{
            padding: '5px',
            width: '100%'
        }}>
            <Box>{ r.senderUserType === 'company' ? 'Компания' : 'Пользователь' } {r.senderName} -{'>'} {r.receiverName}</Box>
            <Box>{r.text ? r.text : 'Текст отзыва отсутствует'}</Box>
            <Box>
                <Button onClick={() => { fetchWithResult(`/admin/review?id=${r.id}`, 
                    { method: 'DELETE' }, showAlert, () => { location.reload(); }) }}>Удалить комментарий</Button>
                    <Button onClick={() => { fetchWithResult(`/admin/ban?` + 
                        `senderUserType=${r.senderUserType}&senderId=${r.senderId}` + 
                        `&receiverId=${r.receiverId}`, 
                    { method: 'PUT' }, showAlert) }}>Забанить</Button>
                <Button onClick={() => { fetchWithResult(`/admin/review?id=${r.id}`, 
                    { method: 'POST' }, showAlert, () => { location.reload(); }) }}>Помиловать</Button>
            </Box>
        </Paper>) : 'Жалоб нет' }</Box>
        {CustomPagination(query, totalElements, (e, value) => {
            query.offset = (value - 1) * 20;
            location.href = `/reports?offset=${query.offset}`
        })}
    </Box>)
}