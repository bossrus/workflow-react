import {Box} from "@mui/material";

function _template_Component() {
    return (
        <>
            <Box display="flex" flexDirection="column" height="100%" boxShadow={3} borderRadius={2} bgcolor={'white'}>
                <Box p={2}>Верхний блок</Box>
                <Box flexGrow={1} overflow="auto" p={2}>
                    Средний блок с прокруткой
                </Box>
                <Box p={2}>Нижний блок</Box>
            </Box>
        </>
    );
}

export default _template_Component;